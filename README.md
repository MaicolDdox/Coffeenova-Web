<p align="center">
    <a href=""_blank>
      <img src="docs/assets/logoTipo.png" width="260" alt="Logo de CoffeeNova API">
    </a>
</p>

[![GitHub](https://img.shields.io/badge/GitHub-MaicolDdox-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/MaicolDdox)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/maicol-duvan-gasca-rodas-4483923a4/?trk=public-profile-join-page)
[![Instagram](https://img.shields.io/badge/Instagram-@maicolddox__-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/maicolddox_?utm_source=qr&igsh=cTV6enRlMW05bjY3)
[![Discord](https://img.shields.io/badge/Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discordapp.com/users/1425631850453270543)
[![Facebook](https://img.shields.io/badge/Facebook-1877F2?style=for-the-badge&logo=facebook&logoColor=white)](https://www.facebook.com/profile.php?id=61586710675179&sk=about_contact_and_basic_info)



<div align="center">
  <h1>CoffeeNova API</h1>
  <p>API REST para el catalogo de cafe, carrito y pedidos de la demo CoffeeNova.</p>
</div>

# CoffeeNova Web (Vue)

Este README documenta el frontend web en Vue de CoffeeNova.
El bloque superior se mantiene por compatibilidad visual.

## Descripcion
CoffeeNova Web es el frontend web de la demo CoffeeNova construido con Vue 3 y Vite.
Consume la CoffeeNova API para el catalogo de cafes, carrito y pedidos.
Incluye autenticacion de usuarios, gestion de ordenes y vistas administrativas.
Este frontend depende obligatoriamente de la API Laravel 12 para funcionar.

## Tecnologias
- Vue 3
- Vite
- Pinia
- Vue Router
- Axios
- Tailwind CSS
- ESLint + Prettier

## Requisitos
- Node.js ^20.19.0 o >=22.12.0 (segun `package.json`)
- npm (usa `package-lock.json`)

## Instalacion
```sh
git clone <URL_DEL_REPO>
cd coffeenova-web
npm install
```
Si tu carpeta local tiene otro nombre, ajusta el `cd`.

## Variables de entorno
Este proyecto no incluye `.env` ni `.env.example`.
La URL base de la API esta definida de forma fija en `src/plugins/axios.js`:

```js
const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: { Accept: 'application/json' },
})
```

Para apuntar a otra instancia de la API, cambia el valor de `baseURL`.

## Ejecutar en desarrollo
```sh
npm run dev
```
Vite levanta el servidor en `http://localhost:5173` por defecto.

## Conexion con la API (OBLIGATORIO)
Este frontend requiere la API Laravel 12 para funcionar. Sigue el README oficial:
https://github.com/MaicolDdox/Coffeenova-API?tab=readme-ov-file

Checklist recomendado:
- [ ] API instalada y corriendo (Laravel 12).
- [ ] Seeders ejecutados (crean permisos, admin y datos demo).
- [ ] URL base del frontend apuntando a la API (`src/plugins/axios.js`).
- [ ] Luego inicia el frontend con `npm run dev`.

## Build / Produccion
```sh
npm run build
npm run preview
```
`npm run preview` permite verificar el build localmente.

## Troubleshooting
- `Network Error` o `ERR_CONNECTION_REFUSED`: la API no esta disponible en `http://localhost:8000`.
- Errores de CORS en consola: habilita el origen del frontend en la API.
- Respuestas 401: token expirado o invalido; borra `localStorage` y vuelve a iniciar sesion.
- 404 en `/api/...`: verifica que la API sea la de CoffeeNova y que los endpoints existan.
- Puerto 5173 ocupado: cierra el proceso que lo usa o cambia el puerto en Vite.

## Creditos
- Autor: MaicolDdox
- Colaboradores: No especificados
