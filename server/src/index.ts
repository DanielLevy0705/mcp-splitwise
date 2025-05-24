import 'dotenv/config';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from "zod";

if (!process.env.SPLITWISE_API_KEY) {
    throw new Error('SPLITWISE_API_KEY is not set in environment variables');
}

const server = new McpServer({
    name: 'mcp-splitwise',
    version: '1.0.0',
});

const headers = {
    'Authorization': `Bearer ${process.env.SPLITWISE_API_KEY}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json',
};

server.tool('get-expenses', 
    {group_id: z.string()},
    async ({group_id}) => {
        const response = await fetch(`https://secure.splitwise.com/api/v3.0/get_expenses?group_id=${group_id}`, {
            headers,
        });
        return {content: [{ type: 'text', text: await response.text() }]};
    }
);

const mcpTransport = new StdioServerTransport();

try {
    await server.connect(mcpTransport);
} catch (error) {
    console.error(error);
}
