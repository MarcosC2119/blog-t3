# 📝 Blog PHP

Un blog simple pero potente desarrollado con PHP y MySQL, con capacidad para gestionar posts y subir imágenes.

## 🚀 Características

- ✨ Interfaz moderna y responsive usando Bootstrap 5
- 📝 Creación de posts con título y contenido
- 🖼️ Soporte para subida de imágenes
- 🔒 Validación y seguridad implementada
- ⚡ Diseño optimizado y limpio
- 🌙 Tema oscuro incorporado

## 🛠️ Tecnologías Utilizadas

- PHP 7+
- MySQL
- Bootstrap 5
- HTML5
- CSS3
- JavaScript

## 📋 Requisitos Previos

- XAMPP/WAMP/LAMP instalado
- PHP 7.0 o superior
- MySQL 5.7 o superior
- Servidor web (Apache recomendado)

## 🔧 Instalación

1. Clona el repositorio en tu directorio web:
```bash
git clone https://github.com/MarcosC2119/BLOG-PHP.git
```

2. Importa la base de datos:
- Abre phpMyAdmin
- Crea una base de datos llamada `DBblog`
- Importa el archivo `sql.txt`

3. Configura la conexión:
- Abre `db.php`
- Ajusta los parámetros de conexión si es necesario

## 📁 Estructura del Proyecto

```
BLOG-PHP/
├── create.php      # Formulario de creación de posts
├── db.php          # Configuración de la base de datos
├── index.html      # Página principal
├── posts.php       # Listado de posts
├── save_post.php   # Procesamiento de posts
├── sql.txt         # Estructura de la base de datos
└── uploads/        # Directorio de imágenes subidas
```

## 🚀 Uso

1. Accede a la página principal: `http://localhost/BLOG-PHP`
2. Navega a "Crear Post" para añadir una nueva entrada
3. Rellena el formulario con título, contenido y opcionalmente una imagen
4. Ve a "Ver Posts" para ver todas las publicaciones

## 🔒 Características de Seguridad

- Validación de entradas de usuario
- Protección contra XSS
- Prepared Statements para prevenir SQL Injection
- Validación de archivos subidos
- Nombres únicos para archivos
- Manejo seguro de sesiones

## 🛠️ Mejoras Futuras

- [ ] Sistema de usuarios
- [ ] Categorías para posts
- [ ] Sistema de comentarios
- [ ] Buscador de posts
- [ ] Editor rico de texto
- [ ] Sistema de etiquetas
- [ ] Paginación
- [ ] Panel de administración

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - mira el archivo [LICENSE.md](LICENSE.md) para detalles

## ✨ Contribuir

Las contribuciones son bienvenidas:

1. Fork el proyecto
2. Crea tu Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la Branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 👥 Autor

- **Tu Nombre** - *Trabajo Inicial* - [MarcosC2119](https://github.com/MarcosC2119)

## 🎉 Agradecimientos

- Bootstrap por el framework CSS
- La comunidad PHP por la inspiración
- GitHub Copilot por la asistencia en el desarrollo