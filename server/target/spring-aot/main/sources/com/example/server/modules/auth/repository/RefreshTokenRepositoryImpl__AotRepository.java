package com.example.server.modules.auth.repository;

import com.example.server.modules.auth.model.RefreshToken;
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
 * AOT generated JPA repository implementation for {@link RefreshTokenRepository}.
 */
@Generated
public class RefreshTokenRepositoryImpl__AotRepository extends AotRepositoryFragmentSupport {
  private final RepositoryFactoryBeanSupport.FragmentCreationContext context;

  private final EntityManager entityManager;

  public RefreshTokenRepositoryImpl__AotRepository(EntityManager entityManager,
      RepositoryFactoryBeanSupport.FragmentCreationContext context) {
    super(QueryEnhancerSelector.DEFAULT_SELECTOR, context);
    this.entityManager = entityManager;
    this.context = context;
  }

  /**
   * AOT generated implementation of {@link RefreshTokenRepository#deleteByUserId(java.lang.Long)}.
   */
  public void deleteByUserId(Long userId) {
    String queryString = "SELECT r FROM RefreshToken r WHERE r.user.id = :userId";
    Query query = this.entityManager.createQuery(queryString);
    query.setParameter("userId", userId);

    List resultList = query.getResultList();
    resultList.forEach(entityManager::remove);
    return;
  }

  /**
   * AOT generated implementation of {@link RefreshTokenRepository#findByToken(java.lang.String)}.
   */
  public Optional<RefreshToken> findByToken(String token) {
    String queryString = "SELECT r FROM RefreshToken r WHERE r.token = :token";
    Query query = this.entityManager.createQuery(queryString);
    query.setParameter("token", token);

    return Optional.ofNullable((RefreshToken) convertOne(query.getSingleResultOrNull(), false, RefreshToken.class));
  }
}
