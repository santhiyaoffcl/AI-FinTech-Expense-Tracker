import fs from 'fs';
import path from 'path';
import { config as loadEnv } from 'dotenv';
import { MongoClient, type Db } from 'mongodb';
import dns from 'dns';

// Configure public DNS resolvers to ensure MongoDB Atlas SRV records resolve correctly
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (err) {
  console.warn('Failed to set public DNS servers:', err);
}

loadEnv();

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const MONGODB_URI = process.env.MONGODB_URI?.trim();
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME?.trim() || 'Fintech_AI';
const USERS_COLLECTION = 'users';
const EXPENSES_COLLECTION = 'expenses';
const INCOMES_COLLECTION = 'incomes';

export interface UserDoc {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  monthlyBudget: number;
  createdAt: string;
}

export interface ExpenseDoc {
  id: string;
  userId: string;
  title: string;
  amount: number;
  category: string; // Food, Transport, Shopping, Medical, Education, Bills, Entertainment, Investment, Others
  date: string; // YYYY-MM-DD
  notes?: string;
  createdAt: string;
}

export interface IncomeDoc {
  id: string;
  userId: string;
  source: 'Salary' | 'Freelancing' | 'Business' | 'Investment' | 'Other';
  amount: number;
  date: string; // YYYY-MM-DD
  description?: string;
  createdAt: string;
}

interface DBData {
  users: UserDoc[];
  expenses: ExpenseDoc[];
  incomes: IncomeDoc[];
}

let memoryData: DBData = {
  users: [],
  expenses: [],
  incomes: [],
};

let mongoClient: MongoClient | null = null;
let mongoDb: Db | null = null;
let mongoConnected = false;

const ensureDataDir = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
};

const readLocalDB = (): DBData | null => {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(raw) as DBData;
    }
  } catch (err) {
    console.error('Error reading local database file:', err);
  }
  return null;
};

const writeLocalDB = () => {
  try {
    ensureDataDir();
    fs.writeFileSync(DB_FILE, JSON.stringify(memoryData, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save DB file:', err);
  }
};

const connectToMongo = async () => {
  if (!MONGODB_URI) {
    return false;
  }

  if (mongoConnected && mongoClient) {
    return true;
  }

  try {
    mongoClient = new MongoClient(MONGODB_URI);
    await mongoClient.connect();
    mongoDb = mongoClient.db(MONGODB_DB_NAME);
    mongoConnected = true;
    console.log(`Connected to MongoDB database: ${MONGODB_DB_NAME}`);
    return true;
  } catch (err) {
    console.error('MongoDB connection failed, falling back to local storage:', err);
    mongoClient = null;
    mongoDb = null;
    mongoConnected = false;
    return false;
  }
};

const loadFromMongo = async (): Promise<DBData | null> => {
  if (!mongoDb) {
    return null;
  }

  try {
    const [users, expenses, incomes] = await Promise.all([
      mongoDb.collection<UserDoc>(USERS_COLLECTION).find().toArray(),
      mongoDb.collection<ExpenseDoc>(EXPENSES_COLLECTION).find().toArray(),
      mongoDb.collection<IncomeDoc>(INCOMES_COLLECTION).find().toArray(),
    ]);

    return {
      users: users ?? [],
      expenses: expenses ?? [],
      incomes: incomes ?? [],
    };
  } catch (err) {
    console.error('Failed to load data from MongoDB:', err);
  }

  return null;
};

const saveToMongo = async () => {
  if (!mongoDb) {
    return;
  }

  try {
    const usersCollection = mongoDb.collection<UserDoc>(USERS_COLLECTION);
    const expensesCollection = mongoDb.collection<ExpenseDoc>(EXPENSES_COLLECTION);
    const incomesCollection = mongoDb.collection<IncomeDoc>(INCOMES_COLLECTION);

    await Promise.all([
      usersCollection.deleteMany({}),
      expensesCollection.deleteMany({}),
      incomesCollection.deleteMany({}),
    ]);

    if (memoryData.users.length > 0) {
      await usersCollection.insertMany(memoryData.users);
    }
    if (memoryData.expenses.length > 0) {
      await expensesCollection.insertMany(memoryData.expenses);
    }
    if (memoryData.incomes.length > 0) {
      await incomesCollection.insertMany(memoryData.incomes);
    }
  } catch (err) {
    console.error('Failed to save data to MongoDB:', err);
  }
};

export const initDB = async () => {
  ensureDataDir();

  const localData = readLocalDB();
  if (localData) {
    memoryData = localData;
  }

  const mongoReady = await connectToMongo();
  if (mongoReady) {
    const mongoData = await loadFromMongo();
    if (mongoData) {
      memoryData = mongoData;
    }
  }

  writeLocalDB();
  if (mongoReady) {
    await saveToMongo();
  }
};

export const saveDB = async () => {
  writeLocalDB();
  await saveToMongo();
};

export const getDB = () => memoryData;
