import { definePlugin } from '@modelcontextprotocol/sdk/server';
import { getDailyAlmanac } from './almanac';
import { ContentType, TabooType, getTungShingParamsSchema } from './types';
import dayjs from 'dayjs';

export default definePlugin({
  name: 'tung-shing',
  version: '1.7.1',
  tools: [
    {
      name: 'get-tung-shing',
      description: '获取通胜黄历，包括公历、农历、宜忌、吉凶、冲煞等信息',
      paramsSchema: getTungShingParamsSchema,
      handler: async ({ startDate, days, includeHours, tabooFilters = [] }) => {
        const start = dayjs(startDate);
        if (!start.isValid()) {
          return {
            content: [
              {
                type: 'text',
                text: 'Invalid date',
              },
            ],
            isError: true,
          };
        }

        return {
          content: Array.from({ length: days }, (_, i) => {
            const almanac = getDailyAlmanac(start.add(i, 'day'), includeHours);
            if (!tabooFilters.length) {
              return {
                type: 'text',
                text: JSON.stringify(almanac),
              };
            }

            const recommends = (almanac.当日[ContentType.宜] as string[]) || [];
            const avoids = (almanac.当日[ContentType.忌] as string[]) || [];

            const hasMatch = tabooFilters.some((filter) => {
              if (filter.type === TabooType.宜) {
                return recommends.includes(filter.value);
              }
              if (filter.type === TabooType.忌) {
                return avoids.includes(filter.value);
              }
              return false;
            });

            if (hasMatch) {
              return {
                type: 'text',
                text: JSON.stringify(almanac),
              };
            }
            return null;
          }).filter(Boolean),
        };
      },
    }
  ],
  prompts: [
    {
      name: 'get-taboo',
      description: '获取宜忌事项类型',
      handler: () => ({
        messages: [
          {
            role: 'assistant',
            content: {
              type: 'text',
              text: `宜忌事项类型清单\n${getDayTabooNames()
                .map((name) => `- ${name}`)
                .join('\n')}`,
            },
          },
        ],
      }),
    }
  ]
});