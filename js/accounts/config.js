import { Client, Account, Databases } from 'appwrite';

const endpoint =
    import.meta.env.VITE_APPWRITE_ENDPOINT ||
    import.meta.env.APPWRITE_ENDPOINT ||
    'https://fra.cloud.appwrite.io/v1';
const projectId =
    import.meta.env.VITE_APPWRITE_PROJECT_ID ||
    import.meta.env.APPWRITE_PROJECT_ID ||
    '69c82581002b6442671c';

const client = new Client().setEndpoint(endpoint).setProject(projectId);

const account = new Account(client);
const databases = new Databases(client); // Added this so you can use your new tables!

export { client, account as auth, databases };