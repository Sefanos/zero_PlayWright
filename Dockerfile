# Multi-stage build for Next.js
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci  # Install all deps for build
COPY . .
RUN npm run build

FROM node:18-alpine AS production
WORKDIR /app
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package*.json ./
RUN npm ci --only=production  # Install only production deps for runtime
EXPOSE 3000
CMD ["npm", "start"]