export function cleanupScene(scene) {
    scene.traverse((node) => {
        if (node.isMesh) {
            // Libérer la géométrie
            if (node.geometry) {
                node.geometry.dispose();
            }
            // Libérer les matériaux et les textures
            if (node.material) {
                if (Array.isArray(node.material)) {
                    node.material.forEach(mat => {
                        if (mat.map) mat.map.dispose();
                        mat.dispose();
                    });
                } else {
                    if (node.material.map) node.material.map.dispose();
                    node.material.dispose();
                }
            }
        }
    });
}