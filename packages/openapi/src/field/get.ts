import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { IFieldVo } from '@teable-group/core';
import { fieldVoSchema } from '@teable-group/core';
import { axios } from '../axios';
import { registerRoute, urlBuilder } from '../utils';
import { z } from '../zod';

export const GET_FIELD = '/tableId/{tableId}/field/{fieldId}';

export const GetFieldRoute: RouteConfig = registerRoute({
  method: 'get',
  path: GET_FIELD,
  description: 'Get a field',
  request: {
    params: z.object({
      tableId: z.string(),
      fieldId: z.string(),
    }),
  },
  responses: {
    200: {
      description: 'Returns data about a field.',
      content: {
        'application/json': {
          schema: fieldVoSchema,
        },
      },
    },
  },
  tags: ['field'],
});

export const getFieldById = async (tableId: string, fieldId: string) => {
  return axios.get<IFieldVo>(
    urlBuilder(GET_FIELD, {
      params: {
        tableId,
        fieldId,
      },
    })
  );
};
