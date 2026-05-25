/**
 * @fileoverview Implementación del mapeador de caracteres españoles a Braille
 * @author Kevin Palacios
 * @version 1.0.0
 */

import { BrailleSymbol, BrailleDots, IBrailleMapper } from '@/types/braille';

/**
 * Clase que implementa el mapeo de caracteres españoles a símbolos Braille
 * Basado en el estándar Braille español (código Braille de 6 puntos)
 */
export class SpanishBrailleMapper implements IBrailleMapper {
  private characterMap: Map<string, BrailleSymbol>;
  
  constructor() {
    this.characterMap = new Map();
    this.initializeMapping();
  }
  
  /**
   * Inicializa el mapeo de caracteres españoles a Braille
   * Incluye: alfabeto, números, vocales acentuadas y signos de puntuación
   */
  private initializeMapping(): void {
    // Alfabeto español (minúsculas)
    this.addMapping('a', [true, false, false, false, false, false], 'Letra A');
    this.addMapping('b', [true, true, false, false, false, false], 'Letra B');
    this.addMapping('c', [true, false, false, true, false, false], 'Letra C');
    this.addMapping('d', [true, false, false, true, true, false], 'Letra D');
    this.addMapping('e', [true, false, false, false, true, false], 'Letra E');
    this.addMapping('f', [true, true, false, true, false, false], 'Letra F');
    this.addMapping('g', [true, true, false, true, true, false], 'Letra G');
    this.addMapping('h', [true, true, false, false, true, false], 'Letra H');
    this.addMapping('i', [false, true, false, true, false, false], 'Letra I');
    this.addMapping('j', [false, true, false, true, true, false], 'Letra J');
    this.addMapping('k', [true, false, true, false, false, false], 'Letra K');
    this.addMapping('l', [true, true, true, false, false, false], 'Letra L');
    this.addMapping('m', [true, false, true, true, false, false], 'Letra M');
    this.addMapping('n', [true, false, true, true, true, false], 'Letra N');
    this.addMapping('ñ', [true, false, true, true, true, true], 'Letra Ñ');
    this.addMapping('o', [true, false, true, false, true, false], 'Letra O');
    this.addMapping('p', [true, true, true, true, false, false], 'Letra P');
    this.addMapping('q', [true, true, true, true, true, false], 'Letra Q');
    this.addMapping('r', [true, true, true, false, true, false], 'Letra R');
    this.addMapping('s', [false, true, true, true, false, false], 'Letra S');
    this.addMapping('t', [false, true, true, true, true, false], 'Letra T');
    this.addMapping('u', [true, false, true, false, false, true], 'Letra U');
    this.addMapping('v', [true, true, true, false, false, true], 'Letra V');
    this.addMapping('w', [false, true, false, true, true, true], 'Letra W');
    this.addMapping('x', [true, false, true, true, false, true], 'Letra X');
    this.addMapping('y', [true, false, true, true, true, true], 'Letra Y');
    this.addMapping('z', [true, false, true, false, true, true], 'Letra Z');
    
    // Alfabeto español (mayúsculas) - mismo código que minúsculas
    // El indicador de mayúscula se inserta separadamente en el transcriber
    this.addMapping('A', [true, false, false, false, false, false], 'Letra A (mayúscula)');
    this.addMapping('B', [true, true, false, false, false, false], 'Letra B (mayúscula)');
    this.addMapping('C', [true, false, false, true, false, false], 'Letra C (mayúscula)');
    this.addMapping('D', [true, false, false, true, true, false], 'Letra D (mayúscula)');
    this.addMapping('E', [true, false, false, false, true, false], 'Letra E (mayúscula)');
    this.addMapping('F', [true, true, false, true, false, false], 'Letra F (mayúscula)');
    this.addMapping('G', [true, true, false, true, true, false], 'Letra G (mayúscula)');
    this.addMapping('H', [true, true, false, false, true, false], 'Letra H (mayúscula)');
    this.addMapping('I', [false, true, false, true, false, false], 'Letra I (mayúscula)');
    this.addMapping('J', [false, true, false, true, true, false], 'Letra J (mayúscula)');
    this.addMapping('K', [true, false, true, false, false, false], 'Letra K (mayúscula)');
    this.addMapping('L', [true, true, true, false, false, false], 'Letra L (mayúscula)');
    this.addMapping('M', [true, false, true, true, false, false], 'Letra M (mayúscula)');
    this.addMapping('N', [true, false, true, true, true, false], 'Letra N (mayúscula)');
    this.addMapping('Ñ', [true, false, true, true, true, true], 'Letra Ñ (mayúscula)');
    this.addMapping('O', [true, false, true, false, true, false], 'Letra O (mayúscula)');
    this.addMapping('P', [true, true, true, true, false, false], 'Letra P (mayúscula)');
    this.addMapping('Q', [true, true, true, true, true, false], 'Letra Q (mayúscula)');
    this.addMapping('R', [true, true, true, false, true, false], 'Letra R (mayúscula)');
    this.addMapping('S', [false, true, true, true, false, false], 'Letra S (mayúscula)');
    this.addMapping('T', [false, true, true, true, true, false], 'Letra T (mayúscula)');
    this.addMapping('U', [true, false, true, false, false, true], 'Letra U (mayúscula)');
    this.addMapping('V', [true, true, true, false, false, true], 'Letra V (mayúscula)');
    this.addMapping('W', [false, true, false, true, true, true], 'Letra W (mayúscula)');
    this.addMapping('X', [true, false, true, true, false, true], 'Letra X (mayúscula)');
    this.addMapping('Y', [true, false, true, true, true, true], 'Letra Y (mayúscula)');
    this.addMapping('Z', [true, false, true, false, true, true], 'Letra Z (mayúscula)');
    
    // Vocales acentuadas
    this.addMapping('á', [true, false, false, false, false, true], 'Letra á');
    this.addMapping('é', [true, true, false, false, false, true], 'Letra é');
    this.addMapping('í', [true, false, false, true, false, true], 'Letra í');
    this.addMapping('ó', [true, false, false, true, true, true], 'Letra ó');
    this.addMapping('ú', [true, false, false, false, true, true], 'Letra ú');
    
    this.addMapping('Á', [true, false, false, false, false, true], 'Letra Á (mayúscula)');
    this.addMapping('É', [true, true, false, false, false, true], 'Letra É (mayúscula)');
    this.addMapping('Í', [true, false, false, true, false, true], 'Letra Í (mayúscula)');
    this.addMapping('Ó', [true, false, false, true, true, true], 'Letra Ó (mayúscula)');
    this.addMapping('Ú', [true, false, false, false, true, true], 'Letra Ú (mayúscula)');
    
    // Números (requieren indicador numérico)
    this.addMapping('0', [false, true, true, true, true, true], 'Número 0');
    this.addMapping('1', [true, false, false, false, false, false], 'Número 1');
    this.addMapping('2', [true, true, false, false, false, false], 'Número 2');
    this.addMapping('3', [true, false, false, true, false, false], 'Número 3');
    this.addMapping('4', [true, false, false, true, true, false], 'Número 4');
    this.addMapping('5', [true, false, false, false, true, false], 'Número 5');
    this.addMapping('6', [true, true, false, true, false, false], 'Número 6');
    this.addMapping('7', [true, true, false, true, true, false], 'Número 7');
    this.addMapping('8', [true, true, false, false, true, false], 'Número 8');
    this.addMapping('9', [false, true, false, true, false, false], 'Número 9');
    
    // Signos de puntuación básicos
    this.addMapping(' ', [false, false, false, false, false, false], 'Espacio');
    this.addMapping('.', [false, true, true, false, false, true], 'Punto');
    this.addMapping(',', [false, true, false, false, false, true], 'Coma');
    this.addMapping(';', [false, true, false, false, true, true], 'Punto y coma');
    this.addMapping(':', [false, true, false, true, false, true], 'Dos puntos');
    this.addMapping('!', [false, true, true, true, false, true], 'Signo de exclamación');
    this.addMapping('¡', [false, true, true, true, true, false], 'Signo de exclamación invertido');
    this.addMapping('?', [false, true, true, true, false, false], 'Signo de interrogación');
    this.addMapping('¿', [false, true, true, true, true, true], 'Signo de interrogación invertido');
    this.addMapping('"', [false, false, true, false, false, true], 'Comillas');
    this.addMapping("'", [false, false, true, false, true, false], 'Apóstrofe');
    this.addMapping('-', [false, false, true, false, true, true], 'Guion');
    this.addMapping('(', [false, true, true, false, true, false], 'Paréntesis abierto');
    this.addMapping(')', [false, true, true, false, true, true], 'Paréntesis cerrado');
    
    // Signos especiales del español
    this.addMapping('ü', [true, false, true, false, true, true], 'Letra ü');
    this.addMapping('Ü', [true, false, true, false, true, true], 'Letra Ü (mayúscula)');
  }
  
  /**
   * Agrega un mapeo de carácter a símbolo Braille
   * @param character Carácter español
   * @param dots Array de 6 booleanos representando los puntos
   * @param description Descripción del símbolo
   */
  private addMapping(character: string, dots: BrailleDots, description: string): void {
    this.characterMap.set(character, {
      dots,
      character,
      description
    });
  }
  
  /**
   * {@inheritDoc}
   */
  public getBrailleSymbol(character: string): BrailleSymbol | null {
    return this.characterMap.get(character) || null;
  }
  
  /**
   * {@inheritDoc}
   */
  public hasMapping(character: string): boolean {
    return this.characterMap.has(character);
  }
  
  /**
   * {@inheritDoc}
   */
  public getAllMappedCharacters(): string[] {
    return Array.from(this.characterMap.keys());
  }
  
  /**
   * Obtiene el indicador numérico para números
   * @returns Símbolo Braille para indicador numérico
   */
  public getNumberIndicator(): BrailleSymbol {
    return {
      dots: [false, false, true, true, true, true],
      character: '#',
      description: 'Indicador numérico'
    };
  }
  
  /**
   * Obtiene el indicador de mayúscula
   * @returns Símbolo Braille para indicador de mayúscula
   */
  public getCapitalIndicator(): BrailleSymbol {
    return {
      dots: [false, false, false, false, true, true],
      character: '⇧',
      description: 'Indicador de mayúscula'
    };
  }
  
  /**
   * Verifica si un carácter es una letra
   * @param character Carácter a verificar
   * @returns True si es una letra
   */
  public isLetter(character: string): boolean {
    return /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]$/.test(character);
  }
  
  /**
   * Verifica si un carácter es un número
   * @param character Carácter a verificar
   * @returns True si es un número
   */
  public isNumber(character: string): boolean {
    return /^[0-9]$/.test(character);
  }
  
  /**
   * Verifica si un carácter es una vocal acentuada
   * @param character Carácter a verificar
   * @returns True si es una vocal acentuada
   */
  public isAccentedVowel(character: string): boolean {
    return /^[áéíóúÁÉÍÓÚ]$/.test(character);
  }
  
  /**
   * Verifica si un carácter es un signo de puntuación
   * @param character Carácter a verificar
   * @returns True si es un signo de puntuación
   */
  public isPunctuation(character: string): boolean {
    return /^[.,;:!?¿¡"'()\-\s]$/.test(character);
  }
}
