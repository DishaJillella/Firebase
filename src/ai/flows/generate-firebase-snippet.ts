'use server';

/**
 * @fileOverview A Firebase code snippet generator AI agent.
 *
 * - generateFirebaseSnippet - A function that handles the code snippet generation process.
 * - GenerateFirebaseSnippetInput - The input type for the generateFirebaseSnippet function.
 * - GenerateFirebaseSnippetOutput - The return type for the generateFirebaseSnippet function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFirebaseSnippetInputSchema = z.object({
  language: z
    .string()
    .describe('The programming language for the code snippet.'),
  firebaseService: z
    .string()
    .describe('The Firebase service to generate code for (e.g., Authentication, Firestore).'),
});
export type GenerateFirebaseSnippetInput = z.infer<
  typeof GenerateFirebaseSnippetInputSchema
>;

const GenerateFirebaseSnippetOutputSchema = z.object({
  codeSnippet: z.string().describe('The generated Firebase code snippet.'),
});
export type GenerateFirebaseSnippetOutput = z.infer<
  typeof GenerateFirebaseSnippetOutputSchema
>;

export async function generateFirebaseSnippet(
  input: GenerateFirebaseSnippetInput
): Promise<GenerateFirebaseSnippetOutput> {
  return generateFirebaseSnippetFlow(input);
}

const getFirebaseSnippet = ai.defineTool({
  name: 'getFirebaseSnippet',
  description: 'Returns a simple Firebase code snippet in the specified language for the specified Firebase service.',
  inputSchema: GenerateFirebaseSnippetInputSchema,
  outputSchema: z.string(),
  async (input) {
    // This can call any typescript function.
    // Return the Firebase code snippet.
    if (input.language === 'JavaScript' && input.firebaseService === 'Authentication') {
      return `
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
      `;
    } else if (input.language === 'Python' && input.firebaseService === 'Firestore') {
      return `
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Use a service account
cred = credentials.Certificate('path/to/serviceAccountKey.json')
firebase_admin.initialize_app(cred)

db = firestore.client()
      `;
    } else {
      return `// Sample code for ${input.language} and ${input.firebaseService}`;
    }
  },
});

const generateFirebaseSnippetPrompt = ai.definePrompt({
  name: 'generateFirebaseSnippetPrompt',
  tools: [getFirebaseSnippet],
  input: {schema: GenerateFirebaseSnippetInputSchema},
  output: {schema: GenerateFirebaseSnippetOutputSchema},
  prompt: `You are a Firebase expert.  The user is trying to get started with Firebase, so generate a simple Firebase code snippet in the specified language for the specified Firebase service. Use the getFirebaseSnippet tool to get the code snippet.

Language: {{{language}}}
Firebase Service: {{{firebaseService}}}

Here is the code snippet:
{{tool_codeSnippet result=getFirebaseSnippet language=language firebaseService=firebaseService}}
`,
});

const generateFirebaseSnippetFlow = ai.defineFlow(
  {
    name: 'generateFirebaseSnippetFlow',
    inputSchema: GenerateFirebaseSnippetInputSchema,
    outputSchema: GenerateFirebaseSnippetOutputSchema,
  },
  async input => {
    const {output} = await generateFirebaseSnippetPrompt(input);
    return output!;
  }
);
