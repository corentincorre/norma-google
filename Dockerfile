FROM node:18-alpine AS builder
WORKDIR /app
# COPY package.json /app/package.json
# COPY package-lock.json /app/package-lock.json
# COPY src /app/src
# COPY .svelte-kit /app/.svelte-kit 
COPY . /app
COPY .env .env
RUN npm ci
RUN npm run build
RUN npm prune --production

RUN npm install supabase --save-dev
#RUN svelte-kit sync
EXPOSE 5173
#ENV HOST=0.0.0.0
ENV NODE_ENV=production
ENV SUPABASE_ACCESS_TOKEN=sbp_3e04a0572c50a6b815c3913d60a63076c8014285
CMD [ "npm", "run", "dev", "--", "--host", "0.0.0.0"]