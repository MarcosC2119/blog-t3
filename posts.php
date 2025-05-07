<?php require 'db.php'; ?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Lista de Posts</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-dark text-light">
    <header class="container mt-5">
        <h1 class="mb-4">Posts del Blog</h1>
        <nav class="mb-4">
            <a href="create.php" class="btn btn-primary mb-3">Crear nuevo post</a>
            <a href="index.html" class="btn btn-secondary mb-3">Inicio</a>
        </nav>
    </header>

    <main class="container">
        <?php
        $result = $conn->query("SELECT * FROM posts ORDER BY created_at DESC");
        while($row = $result->fetch_assoc()):
        ?>
            <article class="card mb-3 bg-light bg-opacity-75 border-secondary text-dark">
                <div class="card-body">
                    <h2 class="card-title text-dark"><?php echo htmlspecialchars($row['title']); ?></h2>
                    <div class="card-text"><?php echo nl2br(htmlspecialchars($row['content'])); ?></div>
                    <?php if($row['image']): ?>
                        <figure class="mt-3 mb-3">
                            <img src="<?php echo htmlspecialchars($row['image']); ?>" class="img-fluid" alt="<?php echo htmlspecialchars($row['title']); ?>">
                        </figure>
                    <?php endif; ?>
                    <footer class="card-text">
                        <small class="text-muted">Publicado: <?php echo date('d/m/Y H:i', strtotime($row['created_at'])); ?></small>
                    </footer>
                </div>
            </article>
        <?php endwhile; ?>
    </main>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
