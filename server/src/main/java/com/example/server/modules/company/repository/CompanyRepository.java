package com.example.server.modules.company.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.server.modules.company.model.Company;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {
    List<Company> findByOwnerId(Long ownerId);

    Optional<Company> findByIdAndOwnerId(Long id, Long ownerId);

    boolean existsByNameAndOwnerId(String name, Long ownerId);
}
