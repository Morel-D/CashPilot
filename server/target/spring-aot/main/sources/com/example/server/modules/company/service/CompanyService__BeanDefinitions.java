package com.example.server.modules.company.service;

import com.example.server.modules.auth.repository.UserRepository;
import com.example.server.modules.company.repository.CompanyRepository;
import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.aot.BeanInstanceSupplier;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.RootBeanDefinition;

/**
 * Bean definitions for {@link CompanyService}.
 */
@Generated
public class CompanyService__BeanDefinitions {
  /**
   * Get the bean instance supplier for 'companyService'.
   */
  private static BeanInstanceSupplier<CompanyService> getCompanyServiceInstanceSupplier() {
    return BeanInstanceSupplier.<CompanyService>forConstructor(UserRepository.class, CompanyRepository.class)
            .withGenerator((registeredBean, args) -> new CompanyService(args.get(0), args.get(1)));
  }

  /**
   * Get the bean definition for 'companyService'.
   */
  public static BeanDefinition getCompanyServiceBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(CompanyService.class);
    beanDefinition.setInstanceSupplier(getCompanyServiceInstanceSupplier());
    return beanDefinition;
  }
}
