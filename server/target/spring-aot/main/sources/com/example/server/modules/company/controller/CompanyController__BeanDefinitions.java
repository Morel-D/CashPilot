package com.example.server.modules.company.controller;

import com.example.server.config.SecurityUtils;
import com.example.server.modules.company.service.CompanyService;
import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.aot.BeanInstanceSupplier;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.RootBeanDefinition;

/**
 * Bean definitions for {@link CompanyController}.
 */
@Generated
public class CompanyController__BeanDefinitions {
  /**
   * Get the bean instance supplier for 'companyController'.
   */
  private static BeanInstanceSupplier<CompanyController> getCompanyControllerInstanceSupplier() {
    return BeanInstanceSupplier.<CompanyController>forConstructor(CompanyService.class, SecurityUtils.class)
            .withGenerator((registeredBean, args) -> new CompanyController(args.get(0), args.get(1)));
  }

  /**
   * Get the bean definition for 'companyController'.
   */
  public static BeanDefinition getCompanyControllerBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(CompanyController.class);
    beanDefinition.setInstanceSupplier(getCompanyControllerInstanceSupplier());
    return beanDefinition;
  }
}
