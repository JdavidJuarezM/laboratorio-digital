package com.laboratoriodigital.backend.services;

import com.laboratoriodigital.backend.models.Recurso;
import com.laboratoriodigital.backend.repositories.RecursoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;

@Service
public class RecursoService {

    @Autowired
    private RecursoRepository recursoRepository;

    // Carpeta donde se guardarán los archivos (dentro del servidor)
    // Para producción real, aquí conectarías con AWS S3
    private final Path fileStorageLocation;

    public RecursoService() {
        this.fileStorageLocation = Paths.get("uploads").toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("No se pudo crear el directorio de subida.", ex);
        }
    }

    public Recurso guardarRecurso(String titulo, String categoria, MultipartFile file) {
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());

        try {
            // Generar nombre único para evitar colisiones
            String uniqueFileName = UUID.randomUUID().toString() + "_" + fileName;
            Path targetLocation = this.fileStorageLocation.resolve(uniqueFileName);

            // Guardar archivo en disco
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // Construir la URL (ajusta el puerto si es necesario, o usa una variable de entorno)
            // En Railway, necesitarás configurar el mapeo de recursos estáticos o usar un servicio de nube real.
            // Para desarrollo local:
            String fileUrl = "/api/recursos/files/" + uniqueFileName;

            Recurso recurso = new Recurso();
            recurso.setTitulo(titulo);
            recurso.setCategoria(categoria);
            recurso.setTipoArchivo(file.getContentType());
            recurso.setUrl(fileUrl);

            return recursoRepository.save(recurso);

        } catch (IOException ex) {
            throw new RuntimeException("No se pudo almacenar el archivo " + fileName, ex);
        }
    }

    public List<Recurso> obtenerPorCategoria(String categoria) {
        return recursoRepository.findByCategoria(categoria);
    }

    public void eliminarRecurso(Long id) {
        // 1. Buscar el recurso primero para obtener su URL/Nombre
        Recurso recurso = recursoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Recurso no encontrado"));

        // 2. Si NO es un enlace web (es decir, es un archivo físico), intentar borrarlo del disco
        if (recurso.getTipoArchivo() != null && !"link".equals(recurso.getTipoArchivo())) {
            try {
                // La URL guardada es tipo: "/api/recursos/files/uuid_nombrearchivo.ext"
                // Extraemos solo la última parte (el nombre del archivo)
                String url = recurso.getUrl();
                String fileName = url.substring(url.lastIndexOf("/") + 1);

                // Construir la ruta completa al archivo
                Path filePath = this.fileStorageLocation.resolve(fileName).normalize();

                // Borrar el archivo si existe
                Files.deleteIfExists(filePath);

            } catch (IOException ex) {
                System.err.println("Advertencia: No se pudo borrar el archivo físico " + recurso.getUrl());
                // No lanzamos error fatal para permitir que se borre de la BD de todos modos
            }
        }

        // 3. Finalmente, borrar el registro de la base de datos
        recursoRepository.delete(recurso);
    }

    public Path loadFileAsResource(String fileName) {
        return this.fileStorageLocation.resolve(fileName).normalize();
    }

    public Recurso guardarEnlace(Recurso recurso) {
        return recursoRepository.save(recurso);
    }
}
