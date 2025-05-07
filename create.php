<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Crear Post</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-dark text-light">
    <main class="container mt-5">
        <h1 class="mb-4">Crear Nuevo Post</h1>
        
        <?php
        session_start();
        if (isset($_SESSION['errors'])) {
            foreach($_SESSION['errors'] as $error) {
                echo '<div class="alert alert-danger" role="alert">' . htmlspecialchars($error) . '</div>';
            }
            unset($_SESSION['errors']);
        }
        if (isset($_SESSION['success'])) {
            echo '<div class="alert alert-success" role="alert">' . htmlspecialchars($_SESSION['success']) . '</div>';
            unset($_SESSION['success']);
        }
        ?>

        <form action="save_post.php" method="POST" enctype="multipart/form-data" class="bg-light bg-opacity-75 p-4 rounded text-dark">
            <div class="mb-3">
                <label for="title" class="form-label">Título</label>
                <input type="text" name="title" id="title" class="form-control" required maxlength="255">
            </div>
            <div class="mb-3">
                <label for="content" class="form-label">Contenido</label>
                <textarea name="content" id="content" class="form-control" rows="5" required></textarea>
            </div>
            <div class="mb-3">
                <label for="image" class="form-label">Imagen</label>
                <input type="file" name="image" id="image" class="form-control" accept="image/jpeg,image/png,image/gif">
                <div class="form-text">Formatos permitidos: JPG, PNG, GIF. Tamaño máximo: 5MB</div>
            </div>
            <div class="mt-4">
                <button type="submit" class="btn btn-success">Guardar</button>
                <a href="index.html" class="btn btn-secondary">Inicio</a>
            </div>
        </form>
    </main>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
