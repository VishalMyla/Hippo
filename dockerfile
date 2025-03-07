# Form Backend AWS EC2 deployment 

# --- Stage 1 : Build Stage ---

FROM node:22.13.0-alpine AS builder
WORKDIR /Hippio 
COPY apps/backend/package.json .
RUN npm install --only=production
COPY ./apps/backend   .
RUN npx prisma generate
RUN npm run build



# --- Stage 2: Production Stage ---
FROM node:22.13.0-alpine 
COPY --from=builder /Hippio/node_modules ./node_modules
COPY --from=builder /Hippio/dist ./dist
COPY --from=builder /Hippio/package.json ./

EXPOSE 5030
CMD [ "npm","run","start" ]






