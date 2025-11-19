# GitHub Readme Stats - Solución de Actualización

## Problema
El servicio de GitHub Readme Stats puede tardar en actualizarse debido a caché.

## Soluciones

### 1. Agregar parámetro de caché-busting
Agrega `&cache_seconds=3600` o un timestamp único para forzar actualización:

```markdown
![GitHub stats](https://github-readme-stats.vercel.app/api?username=marcosc2119&show_icons=true&theme=tokyonight&include_all_commits=true&count_private=true&cache_seconds=3600)
```

### 2. Usar URL con timestamp (fuerza actualización inmediata)
```markdown
![GitHub stats](https://github-readme-stats.vercel.app/api?username=marcosc2119&show_icons=true&theme=tokyonight&include_all_commits=true&count_private=true&cache_seconds=0)
```

### 3. Verificar que el repositorio sea público
- Los repositorios privados requieren `count_private=true` (ya lo tienes)
- Asegúrate de que el repositorio `blog-t3` sea público

### 4. Esperar actualización automática
- El servicio se actualiza automáticamente cada 4-6 horas
- Puede tardar hasta 24 horas en algunos casos

### 5. Verificar email en GitHub
- Asegúrate de que `mcastro2024@alu.uct.cl` esté verificado en GitHub
- Ve a: https://github.com/settings/emails

## URL Actual
```
https://github-readme-stats.vercel.app/api?username=marcosc2119&show_icons=true&theme=tokyonight&include_all_commits=true&count_private=true
```

## URL Recomendada (con caché reducido)
```
https://github-readme-stats.vercel.app/api?username=marcosc2119&show_icons=true&theme=tokyonight&include_all_commits=true&count_private=true&cache_seconds=1800
```

