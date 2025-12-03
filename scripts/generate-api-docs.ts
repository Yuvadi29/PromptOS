import { GoogleGenerativeAI } from '@google/generative-ai';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config({ path: path.join(process.cwd(), '.env') });

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
if (!apiKey) {
    throw new Error('Missing Gemini API Key');
}

const genAI = new GoogleGenerativeAI(apiKey);

interface ApiRoute {
    path: string;
    fullPath: string;
    code: string;
}

// Function to recursively find all route.ts files
function findApiRoutes(dir: string, baseDir: string = dir): ApiRoute[] {
    const routes: ApiRoute[] = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            routes.push(...findApiRoutes(fullPath, baseDir));
        } else if (entry.name === 'route.ts' || entry.name === 'route.js') {
            const code = fs.readFileSync(fullPath, 'utf-8');
            const relativePath = path.relative(baseDir, fullPath);
            const apiPath = relativePath
                .replace(/\\/g, '/')
                .replace('/route.ts', '')
                .replace('/route.js', '');

            routes.push({
                path: `/api/${apiPath}`,
                fullPath,
                code
            });
        }
    }

    return routes;
}

// Function to generate documentation for a single API route
async function generateRouteDocumentation(route: ApiRoute): Promise<string> {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `
You are an expert technical documentation writer. Analyze the following Next.js API route code and generate comprehensive documentation in Markdown format.

API Route Path: ${route.path}

Code:
\`\`\`typescript
${route.code}
\`\`\`

Generate documentation with the following sections:
1. **Endpoint**: The API path
2. **Method(s)**: HTTP methods supported (GET, POST, etc.)
3. **Description**: Brief description of what this endpoint does
4. **Request Body** (if applicable): Expected request body structure with types
5. **Query Parameters** (if applicable): Expected query parameters
6. **Response**: Expected response structure
7. **Status Codes**: Possible status codes and their meanings
8. **Authentication**: Whether authentication is required
9. **Example Request**: cURL or JavaScript example
10. **Example Response**: Sample response JSON

Be concise but thorough. Use code blocks for examples. Format as clean Markdown.
`;

    const result = await model.generateContent(prompt);
    return result.response.text();
}

// Main function
async function generateApiDocumentation() {
    console.log('🔍 Scanning for API routes...');

    const apiDir = path.join(process.cwd(), 'app', 'api');
    const routes = findApiRoutes(apiDir);

    console.log(`✅ Found ${routes.length} API routes`);

    let markdown = `# API Documentation\n\n`;
    markdown += `*Last updated: ${new Date().toLocaleString()}*\n\n`;
    markdown += `This documentation was automatically generated using AI.\n\n`;
    markdown += `---\n\n`;

    for (const route of routes) {
        console.log(`📝 Generating documentation for ${route.path}...`);
        try {
            const doc = await generateRouteDocumentation(route);
            markdown += doc + '\n\n---\n\n';
            // Add delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
            console.error(`❌ Error generating docs for ${route.path}:`, error);
            markdown += `## ${route.path}\n\n*Error generating documentation*\n\n---\n\n`;
        }
    }

    const outputPath = path.join(process.cwd(), 'docs', 'API.md');
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, markdown);

    console.log(`\n✅ Documentation generated successfully!`);
    console.log(`📄 Output: ${outputPath}`);
}

// Run the generator
generateApiDocumentation().catch(console.error);
