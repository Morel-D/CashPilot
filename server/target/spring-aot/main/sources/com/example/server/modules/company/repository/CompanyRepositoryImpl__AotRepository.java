package com.example.server.modules.company.repository;

import com.example.server.modules.company.model.Company;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import java.lang.Long;
import java.lang.String;
import java.util.List;
import java.util.Optional;
import org.springframework.aot.generate.Generated;
import org.springframework.data.jpa.repository.aot.AotRepositoryFragmentSupport;
import org.springframework.data.jpa.repository.query.QueryEnhancerSelector;
import org.springframework.data.repository.core.support.RepositoryFactoryBeanSupport;

/**
 * AOT generated JPA repository implementation for {@link CompanyRepository}.
 */
@Generated
public class CompanyRepositoryImpl__AotRepository extends AotRepositoryFragmentSupport {
  private final RepositoryFactoryBeanSupport.FragmentCreationContext context;

  private final EntityManager entityManager;

  public CompanyRepositoryImpl__AotRepository(EntityManager entityManager,
      RepositoryFactoryBeanSupport.FragmentCreationContext context) {
    super(QueryEnhancerSelector.DEFAULT_SELECTOR, context);
    this.entityManager = entityManager;
    this.context = context;
  }

  /**
   * AOT generated implementation of {@link CompanyRepository#existsByNameAndOwnerId(java.lang.String,java.lang.Long)}.
   */
  public boolean existsByNameAndOwnerId(String name, Long ownerId) {
    String queryString = "SELECT c.id FROM Company c WHERE c.name = :name AND c.owner.id = :ownerId";
    Query query = this.entityManager.createQuery(queryString);
    query.setParameter("name", name);
    query.setParameter("ownerId", ownerId);
    query.setMaxResults(1);

    return !query.getResultList().isEmpty();
  }

  /**
   * AOT generated implementation of {@link CompanyRepository#findByIdAndOwnerId(java.lang.Long,java.lang.Long)}.
   */
  public Optional<Company> findByIdAndOwnerId(Long id, Long ownerId) {
    String queryString = "SELECT c FROM Company c WHERE c.id = :id AND c.owner.id = :ownerId";
    Query query = this.entityManager.createQuery(queryString);
    query.setParameter("id", id);
    query.setParameter("ownerId", ownerId);

    return Optional.ofNullable((Company) convertOne(query.getSingleResultOrNull(), false, Company.class));
  }

  /**
   * AOT generated implementation of {@link CompanyRepository#findByOwnerId(java.lang.Long)}.
   */
  public List<Company> findByOwnerId(Long ownerId) {
    String queryString = "SELECT c FROM Company c WHERE c.owner.id = :ownerId";
    Query query = this.entityManager.createQuery(queryString);
    query.setParameter("ownerId", ownerId);

    return (List<Company>) query.getResultList();
  }
}
