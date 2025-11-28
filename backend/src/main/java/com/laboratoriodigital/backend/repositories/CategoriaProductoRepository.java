package com.laboratoriodigital.backend.repositories;

import com.laboratoriodigital.backend.models.CategoriaProducto;
import com.laboratoriodigital.backend.models.Maestro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CategoriaProductoRepository extends JpaRepository<CategoriaProducto, Long> {
    List<CategoriaProducto> findByMaestro(Maestro maestro);
    Optional<CategoriaProducto> findByNombreAndMaestro(String nombre, Maestro maestro);
}