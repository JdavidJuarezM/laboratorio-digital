package com.laboratoriodigital.backend.repositories;

import com.laboratoriodigital.backend.models.Maestro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MaestroRepository extends JpaRepository<Maestro, Long> {
    Optional<Maestro> findByEmail(String email);

}
