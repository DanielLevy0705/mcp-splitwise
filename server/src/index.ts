// import express from 'express';

// const app = express();
// const port = process.env.PORT || 3000;

// app.get('/', (req, res) => {
//   res.json({ message: 'Hello World' });
// });

// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// }); 

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio";
import { z } from "zod";

const server = new McpServer({
    name: 'mcp-splitwise',
    version: '1.0.0',
});

server.tool('get-expenses', 
    {group_id: z.string()},
    async ({group_id}) => {
        const response = await fetch(`https://secure.splitwise.com/api/v3.0/get_expenses?group_id=${group_id}`);
        return response.json();
    }
);

const mcpTransport = new StdioServerTransport();

try {
    await server.connect(mcpTransport);
} catch (error) {
    console.error(error);
}
