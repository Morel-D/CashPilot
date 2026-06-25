package com.example.server.modules.auth.service;

import com.example.server.config.JwtUtil;
import com.example.server.modules.auth.repository.UserRepository;
import com.example.server.modules.company.service.CompanyService;
import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.aot.BeanInstanceSupplier;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.RootBeanDefinition;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Bean definitions for {@link AuthService}.
 */
@Generated
public class AuthService__BeanDefinitions {
  /**
   * Get the bean instance supplier for 'authService'.
   */
  private static BeanInstanceSupplier<AuthService> getAuthServiceInstanceSupplier() {
    return BeanInstanceSupplier.<AuthService>forConstructor(UserRepository.class, PasswordEncoder.class, JwtUtil.class, CompanyService.class)
            .withGenerator((registeredBean, args) -> new AuthService(args.get(0), args.get(1), args.get(2), args.get(3)));
  }

  /**
   * Get the bean definition for 'authService'.
   */
  public static BeanDefinition getAuthServiceBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(AuthService.class);
    beanDefinition.setInstanceSupplier(getAuthServiceInstanceSupplier());
    return beanDefinition;
  }
}
