package com.example.server.config;

import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.aot.BeanInstanceSupplier;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.RootBeanDefinition;

/**
 * Bean definitions for {@link JwtRequestFilter}.
 */
@Generated
public class JwtRequestFilter__BeanDefinitions {
  /**
   * Get the bean instance supplier for 'jwtRequestFilter'.
   */
  private static BeanInstanceSupplier<JwtRequestFilter> getJwtRequestFilterInstanceSupplier() {
    return BeanInstanceSupplier.<JwtRequestFilter>forConstructor(JwtUtil.class)
            .withGenerator((registeredBean, args) -> new JwtRequestFilter(args.get(0)));
  }

  /**
   * Get the bean definition for 'jwtRequestFilter'.
   */
  public static BeanDefinition getJwtRequestFilterBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(JwtRequestFilter.class);
    beanDefinition.setInstanceSupplier(getJwtRequestFilterInstanceSupplier());
    return beanDefinition;
  }
}
