package com.example.server;

import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.RootBeanDefinition;

/**
 * Bean definitions for {@link ServerApplication}.
 */
@Generated
public class ServerApplication__BeanDefinitions {
  /**
   * Get the bean definition for 'serverApplication'.
   */
  public static BeanDefinition getServerApplicationBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(ServerApplication.class);
    beanDefinition.setInstanceSupplier(ServerApplication::new);
    return beanDefinition;
  }
}
