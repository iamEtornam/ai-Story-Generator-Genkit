"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateStoryFlow = void 0;
const z = __importStar(require("zod"));
const ai_1 = require("@genkit-ai/ai");
const core_1 = require("@genkit-ai/core");
const flow_1 = require("@genkit-ai/flow");
const googleai_1 = require("@genkit-ai/googleai");
const firebase_1 = require("@genkit-ai/firebase");
const googleai_2 = require("@genkit-ai/googleai");
const functions_1 = require("@genkit-ai/firebase/functions");
(0, core_1.configureGenkit)({
    plugins: [
        (0, googleai_1.googleAI)(),
        (0, firebase_1.firebase)({ projectId: "ai-story-generator-app" }),
    ],
    logLevel: 'debug',
    enableTracingAndMetrics: true,
});
const StoryOutputSchema = z.object({
    title: z.string(),
    content: z.string(),
    category: z.string(),
});
// generate story
exports.generateStoryFlow = (0, functions_1.onFlow)({
    name: 'generateStoryFlow',
    authPolicy: (0, functions_1.noAuth)(),
    inputSchema: z.object({
        category: z.string(),
        selectedOptions: z.array(z.string()),
    }),
    outputSchema: StoryOutputSchema,
}, async (data) => {
    const llmResponse = await (0, ai_1.generate)({
        prompt: `Write a creative and engaging story based on the user’s personality and preferences. The user has selected the following preferences: ${data.selectedOptions}. Using these choices as inspiration, craft a story that captures the essence of these preferences and what they reveal about the user.
      
      Begin with an interesting setting that reflects these choices and create a protagonist inspired by these traits. Develop a plot that explores themes or scenarios where these preferences play a key role, showing how they influence the protagonist’s decisions, relationships, and personal journey.
      
      Keep the tone [choose any: lighthearted, mysterious, adventurous, etc.], and aim for a story that feels meaningful or thought-provoking. Make sure the story has a clear beginning, middle, and end, leaving the user with a memorable impression. return the category as ${data.category}`,
        model: googleai_2.gemini15Flash,
        output: {
            schema: StoryOutputSchema,
        },
        config: {
            temperature: 1,
        },
    });
    return llmResponse.output();
});
(0, flow_1.startFlowsServer)();
//# sourceMappingURL=index.js.map