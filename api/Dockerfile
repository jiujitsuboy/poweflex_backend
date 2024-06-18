FROM node:20 as build

WORKDIR /app
COPY . ./

RUN npm install
RUN npm run build

FROM node:20

ARG DB_CONNECTION=sqlserver://localhost:1433;database=powerflex;user=sa;password=SqlS3rv3r24;encrypt=false;trustServerCertificate=true
ENV DATABASE_URL=${DB_CONNECTION}

WORKDIR /app

COPY --from=build /app/build ./build
COPY package*.json ./
COPY prisma prisma

RUN npm ci --only=production

EXPOSE 8000

ENTRYPOINT ["npm","run", "deploy-production"]