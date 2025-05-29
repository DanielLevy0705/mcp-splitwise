import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import z from "zod";

const headers = {
    'Authorization': `Bearer ${process.env.SPLITWISE_API_KEY}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json',
};

export const addTools = async (server: McpServer) => {
    const groups = await fetch('https://secure.splitwise.com/api/v3.0/get_groups', {headers});
    const friends = await fetch('https://secure.splitwise.com/api/v3.0/get_friends', {headers});

    server.tool('get_current_user',
        {},
        async () => {
            const response = await fetch('https://secure.splitwise.com/api/v3.0/get_current_user', {headers});
            return {content: [{ type: 'text', text: await response.text() }]};
        }
    );

    server.tool('get-groups',
        {},
        async () => {
            return {content: [{ type: 'text', text: await groups.text() }]};
        }
    );
    
    server.tool('get-groups-names', {},
        async () => {
            const groupsJson = await groups.json();
            return {content: [{ type: 'text', text: groupsJson.map((group: any) => group.name).join(', ') }]};
        }
    );
    
    server.tool('get-friends',
        {},
        async () => {
            return {content: [{ type: 'text', text: await friends.text() }]};
        }
    );
    
    server.tool('get-friends-names', {},
        async () => {
            const friendsJson = await friends.json();
            return {content: [{ type: 'text', text: friendsJson.map((friend: any) => `${friend.first_name} ${friend.last_name}`).join(', ') }]};
        }
    );
    
    server.tool('get-expenses',
        {},
        async () => {
            const response = await fetch(`https://secure.splitwise.com/api/v3.0/get_expenses`, {
                headers,
            });
            return {content: [{ type: 'text', text: await response.text() }]};
        }
    );

    server.tool('create-expense',
        {
            cost: z.number(),
            description: z.string(),
            group_id: z.number(),
            details: z.string().optional(),
            date: z.string().optional(),
            repeat_interval: z.string().optional(),
            currency_code: z.string().optional(),
            category_id: z.number().optional(),
            split_equally: z.boolean().optional(),
            users: z.array(z.object({
                user_id: z.number(),
                owed_share: z.string(),
                paid_share: z.string(),
            })).optional(),
        },
        async (props) => {
            const { users, ...rest } = props;
            const correctedUsers = users?.map((user, index) => ({
                [`users__${index}__user_id`]: user.user_id,
                [`users__${index}__owed_share`]: user.owed_share,
                [`users__${index}__paid_share`]: user.paid_share,
            }));
            const usersParams = correctedUsers?.reduce((acc, obj) => ({ ...acc, ...obj }), {}) ?? {};
            const response = await fetch(`https://secure.splitwise.com/api/v3.0/create_expense`, {
                headers,
                method: 'POST',
                body: JSON.stringify({
                    ...rest,
                    ...usersParams,
                }),
            });
            return {content: [{ type: 'text', text: await response.text() }]};
        }
    )
}