FROM node:18-alpine3.18 as build

WORKDIR /tmp

ADD . .

RUN npm install

RUN npm run build

FROM node:18-alpine3.18

RUN apk update && apk upgrade

WORKDIR /app

ENV DB=inMemory

COPY --from=build /tmp/build ./
COPY  --from=build /tmp/node_modules ./node_modules
COPY --from=build /tmp/config ./config
COPY --from=build /tmp/src ./src

COPY ./entrypoint.sh ./entrypoint.sh

RUN chmod +x ./entrypoint.sh

ENTRYPOINT [ "./entrypoint.sh" ]