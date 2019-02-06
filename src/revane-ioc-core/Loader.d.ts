import BeanDefinition from './BeanDefinition'
import { static } from 'express';

export default interface Loader {
  load (): Promise<BeanDefinition[]>
}
