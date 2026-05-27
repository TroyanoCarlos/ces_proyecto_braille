import { describe, it, expect, beforeEach } from '@jest/globals';
import { SpanishToBrailleTranscriber } from '@/lib/braille-transcriber';
import { TokenType } from '@/types/braille';

describe('SpanishToBrailleTranscriber', () => {
  let transcriber: SpanishToBrailleTranscriber;

  beforeEach(() => {
    transcriber = new SpanishToBrailleTranscriber();
  });

  describe('transcribe', () => {
    it('debería transcribir texto básico correctamente', () => {
      const input = 'hola';
      const result = transcriber.transcribe(input);

      expect(result).toBeDefined();
      expect(result.originalText).toBe(input);
      expect(result.symbols).toHaveLength(4);
      expect(result.tokens).toHaveLength(4);
      expect(result.statistics.totalCharacters).toBe(4);
      expect(result.statistics.totalSymbols).toBeGreaterThan(0);
      expect(result.statistics.unrecognizedCharacters).toBe(0);
    });

    it('debería manejar texto vacío', () => {
      const input = '';
      const result = transcriber.transcribe(input);

      expect(result.originalText).toBe('');
      expect(result.symbols).toHaveLength(0);
      expect(result.tokens).toHaveLength(0);
      expect(result.statistics.totalCharacters).toBe(0);
    });

    it('debería transcribir números correctamente', () => {
      const input = '123';
      const result = transcriber.transcribe(input);

      // Debe incluir indicador numérico
      expect(result.symbols).toHaveLength(4);
      expect(result.tokens[0].character).toBe('#');
      expect(result.tokens[0].type).toBe(TokenType.PUNCTUATION);
      result.tokens.slice(1).forEach(token => {
        expect(token.type).toBe(TokenType.NUMBER);
      });
    });

    it('deberia transcribir un numero entero con un solo indicador numerico', () => {
      const input = '2026';
      const result = transcriber.transcribe(input);

      const numberIndicators = result.tokens.filter(token => token.character === '#');

      expect(result.originalText).toBe(input);
      expect(result.symbols).toHaveLength(5);
      expect(numberIndicators).toHaveLength(1);
      expect(result.tokens[0].character).toBe('#');
      expect(result.tokens[0].type).toBe(TokenType.PUNCTUATION);
      expect(result.tokens.slice(1).map(token => token.character)).toEqual(['2', '0', '2', '6']);
      result.tokens.slice(1).forEach(token => {
        expect(token.type).toBe(TokenType.NUMBER);
      });
    });

    it('deberia transcribir un numero decimal con un solo indicador numerico', () => {
      const input = '12,50';
      const result = transcriber.transcribe(input);

      const numberIndicators = result.tokens.filter(token => token.character === '#');
      const originalTokens = result.tokens.filter(token => token.character !== '#');

      expect(result.originalText).toBe(input);
      expect(numberIndicators).toHaveLength(1);
      expect(result.tokens[0].character).toBe('#');
      expect(originalTokens.map(token => token.character)).toEqual(['1', '2', ',', '5', '0']);
      expect(originalTokens.map(token => token.type)).toEqual([
        TokenType.NUMBER,
        TokenType.NUMBER,
        TokenType.PUNCTUATION,
        TokenType.NUMBER,
        TokenType.NUMBER
      ]);
    });

    it('deberia transcribir un numero decimal seguido de letras sin repetir indicador numerico', () => {
      const input = '3,14kg';
      const result = transcriber.transcribe(input);

      const numberIndicators = result.tokens.filter(token => token.character === '#');
      const originalTokens = result.tokens.filter(token => token.character !== '#');

      expect(result.originalText).toBe(input);
      expect(numberIndicators).toHaveLength(1);
      expect(originalTokens.map(token => token.character)).toEqual(['3', ',', '1', '4', 'k', 'g']);
      expect(originalTokens.map(token => token.type)).toEqual([
        TokenType.NUMBER,
        TokenType.PUNCTUATION,
        TokenType.NUMBER,
        TokenType.NUMBER,
        TokenType.LETTER,
        TokenType.LETTER
      ]);
      expect(result.statistics.totalCharacters).toBe(input.length);
      expect(result.statistics.unrecognizedCharacters).toBe(0);
    });

    it('debería transcribir vocales acentuadas', () => {
      const input = 'áéíóú';
      const result = transcriber.transcribe(input);

      expect(result.symbols).toHaveLength(5);
      result.tokens.forEach(token => {
        expect(token.type).toBe(TokenType.ACCENTED_VOWEL);
      });
    });

    it('debería manejar mayúsculas', () => {
      const input = 'Hola';
      const result = transcriber.transcribe(input);

      expect(result.symbols.length).toBeGreaterThan(4); // Incluye indicador de mayúscula
      expect(result.tokens[0].character).toBe('⇧');
      expect(result.tokens[0].type).toBe(TokenType.PUNCTUATION);
      expect(result.tokens[1].character).toBe('H');
    });

    it('debería manejar espacios', () => {
      const input = 'hola mundo';
      const result = transcriber.transcribe(input);

      expect(result.tokens).toHaveLength(10); // 'hola' + espacio + 'mundo'
      expect(result.tokens[4].type).toBe(TokenType.SPACE);
    });

    it('debería manejar signos de puntuación', () => {
      const input = 'hola, mundo!';
      const result = transcriber.transcribe(input);

      expect(result.tokens[4].type).toBe(TokenType.PUNCTUATION); // coma
      expect(result.tokens[11].type).toBe(TokenType.PUNCTUATION); // exclamación
    });

    it('debería manejar texto mixto', () => {
      const input = 'Hola 123, áéíóú.';
      const result = transcriber.transcribe(input);

      expect(result.statistics.totalCharacters).toBe(16);
      expect(result.tokens.length).toBeGreaterThan(16);

      const originalTokens = result.tokens.filter(token => token.character !== '⇧' && token.character !== '#');
      expect(originalTokens).toHaveLength(16);
      
      // Verificar tipos de tokens
      expect(originalTokens[0].type).toBe(TokenType.LETTER); // H
      expect(originalTokens[5].type).toBe(TokenType.NUMBER); // 1
      expect(originalTokens[8].type).toBe(TokenType.PUNCTUATION); // ,
      expect(originalTokens[10].type).toBe(TokenType.ACCENTED_VOWEL); // á
    });

    it('debería lanzar error para caracteres no soportados', () => {
      const input = 'hola@';
      
      expect(() => {
        transcriber.transcribe(input);
      }).toThrow('El texto contiene caracteres no soportados');
    });

    it('debería manejar configuración personalizada', () => {
      const input = 'hola';
      const config = {
        useContractions: true,
        displayMode: 'binary' as const,
        formatting: {
          preserveCase: false,
          preserveSpaces: true
        }
      };
      
      const result = transcriber.transcribe(input, config);
      
      expect(result).toBeDefined();
      expect(result.originalText).toBe(input);
    });
  });

  describe('validateInput', () => {
    it('debería validar texto con caracteres soportados', () => {
      const validText = 'Hola mundo 123, áéíóú.';
      expect(transcriber.validateInput(validText)).toBe(true);
    });

    it('debería rechazar texto con caracteres no soportados', () => {
      const invalidText = 'hola@';
      expect(transcriber.validateInput(invalidText)).toBe(false);
    });

    it('debería aceptar texto vacío', () => {
      expect(transcriber.validateInput('')).toBe(true);
    });

    it('debería aceptar solo espacios', () => {
      expect(transcriber.validateInput('   ')).toBe(true);
    });
  });

  describe('getUnrecognizedCharacters', () => {
    it('debería identificar caracteres no soportados', () => {
      const input = 'hola@#$';
      const unrecognized = transcriber.getUnrecognizedCharacters(input);
      
      expect(unrecognized).toContain('@');
      expect(unrecognized).toContain('#');
      expect(unrecognized).toContain('$');
      expect(unrecognized).toHaveLength(3);
    });

    it('debería retornar array vacío para texto válido', () => {
      const input = 'hola mundo 123';
      const unrecognized = transcriber.getUnrecognizedCharacters(input);
      
      expect(unrecognized).toHaveLength(0);
    });

    it('no debería duplicar caracteres', () => {
      const input = 'hola@@';
      const unrecognized = transcriber.getUnrecognizedCharacters(input);
      
      expect(unrecognized).toHaveLength(1);
      expect(unrecognized[0]).toBe('@');
    });
  });

  describe('getDetailedStatistics', () => {
    it('debería calcular estadísticas detalladas correctamente', () => {
      const input = 'Hola 123, áéíóú.';
      const stats = transcriber.getDetailedStatistics(input);
      
      expect(stats.letters).toBe(4); // Hola
      expect(stats.numbers).toBe(3); // 123
      expect(stats.accentedVowels).toBe(5); // áéíóú
      expect(stats.punctuation).toBe(2); // , y .
      expect(stats.spaces).toBe(2); // espacios
      expect(stats.unrecognized).toBe(0);
    });

    it('debería manejar texto vacío', () => {
      const input = '';
      const stats = transcriber.getDetailedStatistics(input);
      
      expect(stats.letters).toBe(0);
      expect(stats.numbers).toBe(0);
      expect(stats.accentedVowels).toBe(0);
      expect(stats.punctuation).toBe(0);
      expect(stats.spaces).toBe(0);
      expect(stats.unrecognized).toBe(0);
    });
  });

  describe('getLastStatistics', () => {
    it('debería retornar estadísticas de la última transcripción', () => {
      const input = 'hola';
      transcriber.transcribe(input);
      
      const stats = transcriber.getLastStatistics();
      
      expect(stats).toBeDefined();
      expect(stats!.totalCharacters).toBe(4);
      expect(stats!.totalSymbols).toBeGreaterThan(0);
    });

    it('debería retornar null si no hay transcripción previa', () => {
      const stats = transcriber.getLastStatistics();
      
      expect(stats).toBeNull();
    });
  });

  describe('performance', () => {
    it('debería transcribir texto largo en tiempo razonable', () => {
      const longText = 'hola mundo '.repeat(100); // 1100 caracteres
      const startTime = performance.now();
      
      const result = transcriber.transcribe(longText);
      
      const endTime = performance.now();
      const processingTime = endTime - startTime;
      
      expect(result).toBeDefined();
      expect(processingTime).toBeLessThan(1000); // Menos de 1 segundo
      expect(result.statistics.processingTime).toBeLessThan(1000);
    });

    it('debería manejar múltiples transcripciones consecutivas', () => {
      const texts = ['hola', 'mundo', '123', 'áéíóú'];
      
      texts.forEach(text => {
        const result = transcriber.transcribe(text);
        expect(result).toBeDefined();
        expect(result.originalText).toBe(text);
      });
    });
  });

  describe('casos límite', () => {
    it('debería manejar caracteres especiales del español', () => {
      const input = 'ñüÑÜ';
      const result = transcriber.transcribe(input);
      
      expect(result.symbols).toHaveLength(6); // Incluye indicadores para Ñ y Ü
      expect(result.statistics.unrecognizedCharacters).toBe(0);
    });

    it('debería manejar signos de interrogación y exclamación invertidos', () => {
      const input = '¿Hola mundo!';
      const result = transcriber.transcribe(input);
      
      expect(result.tokens[0].type).toBe(TokenType.PUNCTUATION); // ¿
      expect(result.tokens[12].type).toBe(TokenType.PUNCTUATION); // !
      expect(result.statistics.unrecognizedCharacters).toBe(0);
    });

    it('debería manejar texto con solo puntuación', () => {
      const input = '.,;:¿¡!';
      const result = transcriber.transcribe(input);
      
      expect(result.symbols).toHaveLength(7);
      result.tokens.forEach(token => {
        expect(token.type).toBe(TokenType.PUNCTUATION);
      });
    });

    it('debería manejar números con cero inicial', () => {
      const input = '0123';
      const result = transcriber.transcribe(input);
      
      expect(result.symbols.length).toBeGreaterThan(4); // Incluye indicador numérico
      expect(result.tokens[0].character).toBe('#');
      result.tokens.slice(1, 5).forEach(token => {
        expect(token.type).toBe(TokenType.NUMBER);
      });
    });
  });
});

describe('Integración - Flujo Completo', () => {
  let transcriber: SpanishToBrailleTranscriber;

  beforeEach(() => {
    transcriber = new SpanishToBrailleTranscriber();
  });

  it('debería procesar flujo completo de transcripción', () => {
    const input = '¡Hola, mundo! Este es un test: 123.';
    const result = transcriber.transcribe(input);
    
    // Verificar estructura completa
    expect(result.originalText).toBe(input);
    expect(result.symbols.length).toBeGreaterThan(0);
    expect(result.tokens.length).toBeGreaterThan(input.length);
    expect(result.brailleText).toBeDefined();
    expect(result.statistics).toBeDefined();

    const originalTokens = result.tokens.filter(token => token.character !== '⇧' && token.character !== '#');
    expect(originalTokens).toHaveLength(input.length);
    
    // Verificar tipos de tokens específicos
    expect(originalTokens[0].type).toBe(TokenType.PUNCTUATION); // ¡
    expect(originalTokens[1].type).toBe(TokenType.LETTER); // H
    expect(originalTokens[5].type).toBe(TokenType.PUNCTUATION); // ,
    expect(originalTokens[6].type).toBe(TokenType.SPACE); // espacio
    expect(originalTokens[31].type).toBe(TokenType.NUMBER); // 1
    
    // Verificar estadísticas
    expect(result.statistics.totalCharacters).toBe(input.length);
    expect(result.statistics.unrecognizedCharacters).toBe(0);
    expect(result.statistics.processingTime).toBeGreaterThan(0);
  });

  it('debería mantener consistencia entre transcripciones', () => {
    const input = 'hola mundo';
    const result1 = transcriber.transcribe(input);
    const result2 = transcriber.transcribe(input);
    
    expect(result1.brailleText).toBe(result2.brailleText);
    expect(result1.symbols.length).toBe(result2.symbols.length);
    expect(result1.statistics.totalCharacters).toBe(result2.statistics.totalCharacters);
  });
});
