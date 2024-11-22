import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { loadJson } from '../../lib/jnj-lib-base';

const PACKAGE_JSON = 'C:/JnJ-soft/Projects/internal/backend-node/package.json';

// GraphQL 스키마 정의
const typeDefs = `#graphql
  type Query {
    hello: String
    getPackageInfo: PackageInfo
  }

  type PackageInfo {
    name: String
    version: String
    description: String
    author: String
  }
`;

// 리졸버 정의
const resolvers = {
  Query: {
    hello: () => 'Hello World!',
    getPackageInfo: () => {
      const packageJson = loadJson(PACKAGE_JSON);
      return {
        name: packageJson.name,
        version: packageJson.version,
        description: packageJson.description,
        author: packageJson.author,
      };
    },
  },
};

async function startApolloServer() {
  // Express 앱 생성
  const app = express();

  // Apollo Server 인스턴스 생성
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  // Apollo Server 시작
  await server.start();

  // Express에 미들웨어 적용
  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    bodyParser.json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({ token: req.headers.token }),
    })
  );

  // 서버 시작
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
  });
}

// 서버 시작
startApolloServer().catch(console.error);
