import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

async function main() {
    const transport = new StdioClientTransport({
        command: "node",
        args: ["./dist/index.js"]
    });
      
    const client = new Client(
    {
        name: "example-client",
        version: "1.0.0"
    }
    );
    
    await client.connect(transport);
    console.log('Connected to MCP server');

    const tempGroupId_ourHome = '61532785'
    const result = await client.callTool({
        name: 'get-expenses',
        arguments: {
            group_id: tempGroupId_ourHome
        }
    });

    console.log(result);
     
}

main().catch(console.error); 