import * as z from 'zod';

import { generate } from '@genkit-ai/ai';
import { configureGenkit } from '@genkit-ai/core';
import { defineFlow, startFlowsServer } from '@genkit-ai/flow';
import { googleAI } from '@genkit-ai/googleai';
import { firebase } from '@genkit-ai/firebase';
import {firebaseAuth} from "@genkit-ai/firebase/auth";
import { gemini15Flash } from '@genkit-ai/googleai';
import {noAuth, onFlow} from "@genkit-ai/firebase/functions";

configureGenkit({
  plugins: [
    googleAI(),
    firebase({projectId: "ai-story-generator-app"}),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});

type StoryOutput = z.infer<typeof StoryOutputSchema>;

const StoryOutputSchema = z.object({
  title: z.string(),
  content: z.string(),
  category: z.string(),
});


// generate story
export const generateStoryFlow = defineFlow(
  {
    name: 'generateStoryFlow',
    inputSchema: z.object({
      category: z.string(),
      selectedOptions: z.array(
        z.string()
      ),
    }),
    outputSchema: StoryOutputSchema,
  },
  async (data) => {
    const llmResponse = await generate({
      prompt: `Write a creative and engaging story based on the user’s personality and preferences. The user has selected the following preferences: ${data.selectedOptions}. Using these choices as inspiration, craft a story that captures the essence of these preferences and what they reveal about the user.
      
      Begin with an interesting setting that reflects these choices and create a protagonist inspired by these traits. Develop a plot that explores themes or scenarios where these preferences play a key role, showing how they influence the protagonist’s decisions, relationships, and personal journey.
      
      Keep the tone [choose any: lighthearted, mysterious, adventurous, etc.], and aim for a story that feels meaningful or thought-provoking. Make sure the story has a clear beginning, middle, and end, leaving the user with a memorable impression. return the category as ${data.category}`,
      model: gemini15Flash,
      output: {
        schema: StoryOutputSchema,
      },
      config: {
        temperature: 1,
      },
    });
    
    return llmResponse.output() as any;
  }
);

startFlowsServer();
