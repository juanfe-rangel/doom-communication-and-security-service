
#  Doom Communication & Security Service

Microservicio REST para la gestión de viajes compartidos, parte de la plataforma **RIDECI LEGACY**.

Construido con **NestJS**, **MongoDB** (a través de Prisma ORM) y **RabbitMQ** para la comunicación asíncrona entre microservicios.

---

# 🛠️ Tecnologías Principales

| Tecnología                  | Uso                                 |
| --------------------------- | ----------------------------------- |
| 🚀 NestJS 11                | Framework principal                 |
| 🍃 Postgre + Prisma 6       | Base de datos y ORM                 |
| 🍃 Redis + Prisma 6       | Base de datos y ORM                 |
| 📨 RabbitMQ (amqplib)       | Mensajería basada en eventos        |
| 📖 Swagger / OpenAPI        | Documentación interactiva de la API |

---

# 🏗️ Arquitectura

El servicio implementa **Arquitectura Hexagonal (Ports & Adapters)** para mantener desacoplada la lógica de negocio de los detalles de infraestructura.

```text
src/
├── travels/
│   ├── domain/              # 🧠 Entidades y enums del negocio
│   ├── application/
│   │   ├── service/         # ⚙️ Casos de uso y lógica de negocio
│   │   ├── ports      
│   │       ├── out/         # 🔌 Interfaces (repositorios y publicadores)
│   │       └── in/          # 🔌 Interfaces (Casos de uso )
│   │   └── events/          # 📡 Eventos de dominio
│   └── infrastructure/
│       ├── controller/      # 🌐 Controladores HTTP + DTOs
│       ├── persistence/     # 💾 Adaptador Prisma/Postre/redis
│       └── rabbit/          # 🐇 Adaptador RabbitMQ
└── 
```

---

# ⚙️ Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto usando `.env.example` como referencia:

```env
DATABASE_URL=mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/<database>
RABBITMQ_URL=amqp://localhost
PORT=3000
```


---

# 🚀 Instalación y Ejecución

## 📋 Prerequisitos

* Node.js 18 o superior
* npm
* Postgre (local o Atlas)
* RabbitMQ (opcional)

---

## 1️⃣ Clonar el repositorio

```bash
git clone <url-del-repositorio>
```

## 2️⃣ Instalar dependencias

```bash
npm install
```

## 3️⃣ Configurar variables de entorno

```bash
cp .env.example .env
```

Editar el archivo `.env` con las credenciales correspondientes.

## 4️⃣ Generar cliente Prisma

```bash
npm exec prisma generate
```

## 5️⃣ Ejecutar el servicio

### 🔥 Desarrollo

```bash
npm run start:dev
```

### 📦 Producción

```bash
npm run build
npm run start:prod
```

---

## ✅ Verificar funcionamiento

| Recurso                | URL                           |
| ---------------------- | ----------------------------- |
| 🌐 API                 | http://localhost:3000         |
| 📖 Swagger UI          | http://localhost:3000/docs    |

---

# 🛣️ Endpoints

                         

---

# 📦 Modelo Principal

## 

```json

```

---

# 📑 Enumeraciones

| Campo          | Valores Permitidos                                    |
| -------------- | ----------------------------------------------------- |
| 🚦 Status      | `CREATED` · `IN_PROGRESS` · `COMPLETED` · `CANCELLED` |
| 🗓️ TravelType | `DAILY` · `OCCASIONAL`                                |
| 🚘 VehicleType | `CAR` · `MOTORCYCLE` · `BUS` · `BICYCLE`              |

---

# 📨 Eventos Publicados en RabbitMQ

**Exchange:** `travel.exchange` *(tipo: topic)*

| Evento                 | Routing Key                 | Descripción           |
| ---------------------- | --------------------------- | --------------------- |
| 🎉 TravelCreatedEvent  | `travel.created`            | Se crea un viaje      |
| ✏️ TravelUpdatedEvent  | `travel.updated`            | Se actualiza un viaje |
| ✅ TravelCompletedEvent | `travel.completed`          | El viaje finaliza     |
| ❌ TravelCancelledEvent | `travel.cancelled`          | El viaje es cancelado |
| 👥 TravelUpdatedEvent  | `travel.passengers.updated` | Cambian los pasajeros |

---

# 📖 Documentación Swagger

![Swagger](docs/img/swagger.png)

---


# 📨 Diagramas


## Diagrama De contexto

![contexto](docs/UML/Diagramas-Contexto.drawio.png)

## Diagrama De Contenedores

![contenedor](docs/UML/Diagramas-Contenedor.drawio%20(1).png)


## Diagrama De Componentes

![Componentes](docs/UML/Diagramas-Componentes.drawio.png)


## Diagrama de Clases

![Clases](docs/UML/Diagramas-Clases.drawio.png)


## Diagrama Entidad-Relación

![Entidad-Relacion](docs/UML/Diagramas-DB.drawio.png)




---


# 👤👤 Equipo de Desarrollo
- [@Santiago Suarez](https://github.com/SantiagoSu15)
- [@Felipe Rangel](https://github.com/juanfe-rangel)


