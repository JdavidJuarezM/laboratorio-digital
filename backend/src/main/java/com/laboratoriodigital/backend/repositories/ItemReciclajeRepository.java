package com.laboratoriodigital.backend.repositories;

import com.laboratoriodigital.backend.models.ItemReciclaje;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemReciclajeRepository extends JpaRepository<ItemReciclaje, Long> {
}