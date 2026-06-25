package com.example.server.config;

import com.example.server.modules.auth.repository.UserRepository;
import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.aot.BeanInstanceSupplier;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.RootBeanDefinition;
import org.springframework.context.annotation.ConfigurationClassUtils;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Bean definitions for {@link SecurityUtils}.
 */
@Generated
public class SecurityUtils__BeanDefinitions {
  /**
   * Get the bean instance supplier for 'securityUtils'.
   */
  private static BeanInstanceSupplier<SecurityUtils> getSecurityUtilsInstanceSupplier() {
    return BeanInstanceSupplier.<SecurityUtils>forConstructor(UserRepository.class)
            .withGenerator((registeredBean, args) -> new SecurityUtils$$SpringCGLIB$$0(args.get(0)));
  }

  /**
   * Get the bean definition for 'securityUtils'.
   */
  public static BeanDefinition getSecurityUtilsBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(SecurityUtils.class);
    beanDefinition.setTargetType(SecurityUtils.class);
    ConfigurationClassUtils.initializeConfigurationClass(SecurityUtils.class);
    beanDefinition.setInstanceSupplier(getSecurityUtilsInstanceSupplier());
    return beanDefinition;
  }

  /**
   * Get the bean instance supplier for 'passwordEncoder'.
   */
  private static BeanInstanceSupplier<PasswordEncoder> getPasswordEncoderInstanceSupplier() {
    return BeanInstanceSupplier.<PasswordEncoder>forFactoryMethod(SecurityUtils$$SpringCGLIB$$0.class, "passwordEncoder")
            .withGenerator((registeredBean) -> registeredBean.getBeanFactory().getBean("securityUtils", SecurityUtils.class).passwordEncoder());
  }

  /**
   * Get the bean definition for 'passwordEncoder'.
   */
  public static BeanDefinition getPasswordEncoderBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(PasswordEncoder.class);
    beanDefinition.setFactoryBeanName("securityUtils");
    beanDefinition.setInstanceSupplier(getPasswordEncoderInstanceSupplier());
    return beanDefinition;
  }
}
