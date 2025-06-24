/**
 * Real Alignment Engineering Implementation
 * Actually analyzes files and detects misalignment
 */

import fs from 'fs/promises';
import path from 'path';

export class RealAlignmentEngineer {
  constructor() {
    this.supportedExtensions = ['.js', '.ts', '.py', '.md', '.json', '.yaml', '.yml'];
  }

  async engineerAlignment(projectPath, statedPurpose) {
    try {
      // Real file system analysis
      const projectAnalysis = await this.analyzeProject(projectPath);
      const purposeAnalysis = await this.analyzePurpose(statedPurpose);
      const alignmentAnalysis = await this.detectMisalignment(projectAnalysis, purposeAnalysis);
      
      return {
        timestamp: new Date().toISOString(),
        project_path: projectPath,
        stated_purpose: statedPurpose,
        project_analysis: projectAnalysis,
        purpose_analysis: purposeAnalysis,
        alignment_analysis: alignmentAnalysis,
        cleanup_plan: await this.generateCleanupPlan(alignmentAnalysis),
        confidence: this.calculateConfidence(alignmentAnalysis)
      };
    } catch (error) {
      return {
        error: `Alignment analysis failed: ${error.message}`,
        timestamp: new Date().toISOString()
      };
    }
  }

  async analyzeProject(projectPath) {
    const analysis = {
      total_files: 0,
      code_files: [],
      config_files: [],
      documentation_files: [],
      functionality_detected: [],
      dependencies: [],
      file_analysis: {}
    };

    try {
      const files = await this.getAllFiles(projectPath);
      analysis.total_files = files.length;

      for (const file of files) {
        const relativePath = path.relative(projectPath, file);
        const extension = path.extname(file);
        
        if (this.supportedExtensions.includes(extension)) {
          const content = await fs.readFile(file, 'utf-8');
          const fileAnalysis = await this.analyzeFile(relativePath, content, extension);
          
          analysis.file_analysis[relativePath] = fileAnalysis;
          
          // Categorize files
          if (['.js', '.ts', '.py'].includes(extension)) {
            analysis.code_files.push(relativePath);
            analysis.functionality_detected.push(...fileAnalysis.functions_detected);
          } else if (['.json', '.yaml', '.yml'].includes(extension)) {
            analysis.config_files.push(relativePath);
          } else if (extension === '.md') {
            analysis.documentation_files.push(relativePath);
          }
        }
      }

      // Extract dependencies
      analysis.dependencies = await this.extractDependencies(projectPath);
      
      return analysis;
    } catch (error) {
      throw new Error(`Project analysis failed: ${error.message}`);
    }
  }

  async getAllFiles(dir) {
    const files = [];
    
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        // Skip common ignore patterns
        if (this.shouldIgnore(entry.name)) continue;
        
        if (entry.isDirectory()) {
          files.push(...await this.getAllFiles(fullPath));
        } else {
          files.push(fullPath);
        }
      }
    } catch (error) {
      // Directory might not exist or be accessible
      console.error(`Error reading directory ${dir}: ${error.message}`);
    }
    
    return files;
  }

  shouldIgnore(name) {
    const ignorePatterns = [
      'node_modules', '.git', '.vscode', 'dist', 'build', 
      '.DS_Store', 'coverage', '.nyc_output', 'logs'
    ];
    return ignorePatterns.some(pattern => name.includes(pattern));
  }

  async analyzeFile(relativePath, content, extension) {
    const analysis = {
      file_path: relativePath,
      extension: extension,
      line_count: content.split('\n').length,
      functions_detected: [],
      imports_detected: [],
      keywords_detected: [],
      purpose_indicators: []
    };

    // Detect functions/classes/methods
    if (['.js', '.ts'].includes(extension)) {
      analysis.functions_detected = this.extractJavaScriptFunctions(content);
      analysis.imports_detected = this.extractJavaScriptImports(content);
    } else if (extension === '.py') {
      analysis.functions_detected = this.extractPythonFunctions(content);
      analysis.imports_detected = this.extractPythonImports(content);
    }

    // Detect purpose-related keywords
    analysis.keywords_detected = this.extractKeywords(content);
    analysis.purpose_indicators = this.detectPurposeIndicators(content);

    return analysis;
  }

  extractJavaScriptFunctions(content) {
    const functions = [];
    
    // Function declarations
    const functionRegex = /(?:function\s+(\w+)|(\w+)\s*[:=]\s*(?:async\s+)?function|class\s+(\w+))/g;
    let match;
    
    while ((match = functionRegex.exec(content)) !== null) {
      const functionName = match[1] || match[2] || match[3];
      if (functionName) {
        functions.push({
          name: functionName,
          type: match[3] ? 'class' : 'function',
          line: content.substring(0, match.index).split('\n').length
        });
      }
    }
    
    return functions;
  }

  extractJavaScriptImports(content) {
    const imports = [];
    const importRegex = /(?:import\s+.*?\s+from\s+['"]([^'"]+)['"]|require\(['"]([^'"]+)['"]\))/g;
    let match;
    
    while ((match = importRegex.exec(content)) !== null) {
      imports.push(match[1] || match[2]);
    }
    
    return imports;
  }

  extractPythonFunctions(content) {
    const functions = [];
    const functionRegex = /(?:def\s+(\w+)|class\s+(\w+))/g;
    let match;
    
    while ((match = functionRegex.exec(content)) !== null) {
      const name = match[1] || match[2];
      functions.push({
        name: name,
        type: match[2] ? 'class' : 'function',
        line: content.substring(0, match.index).split('\n').length
      });
    }
    
    return functions;
  }

  extractPythonImports(content) {
    const imports = [];
    const importRegex = /(?:from\s+(\w+)|import\s+(\w+))/g;
    let match;
    
    while ((match = importRegex.exec(content)) !== null) {
      imports.push(match[1] || match[2]);
    }
    
    return imports;
  }

  extractKeywords(content) {
    const keywords = [
      'orchestration', 'agent', 'customer', 'service', 'flight', 'booking', 
      'deployment', 'security', 'monitoring', 'performance', 'optimization',
      'intelligent', 'alignment', 'engineering'
    ];
    
    const detected = [];
    const lowerContent = content.toLowerCase();
    
    for (const keyword of keywords) {
      const count = (lowerContent.match(new RegExp(keyword, 'g')) || []).length;
      if (count > 0) {
        detected.push({ keyword, count });
      }
    }
    
    return detected;
  }

  detectPurposeIndicators(content) {
    const indicators = [];
    
    // Look for purpose statements
    const purposePatterns = [
      /purpose[:\s]+([^\n]+)/gi,
      /description[:\s]+([^\n]+)/gi,
      /overview[:\s]+([^\n]+)/gi,
      /@description\s+([^\n]+)/gi
    ];
    
    for (const pattern of purposePatterns) {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        indicators.push({
          type: 'purpose_statement',
          content: match[1].trim(),
          line: content.substring(0, match.index).split('\n').length
        });
      }
    }
    
    return indicators;
  }

  async extractDependencies(projectPath) {
    const dependencies = [];
    
    try {
      // Check package.json
      const packageJsonPath = path.join(projectPath, 'package.json');
      try {
        const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
        if (packageJson.dependencies) {
          dependencies.push(...Object.keys(packageJson.dependencies));
        }
        if (packageJson.devDependencies) {
          dependencies.push(...Object.keys(packageJson.devDependencies));
        }
      } catch (error) {
        // package.json might not exist
      }
      
      // Check requirements.txt
      const requirementsPath = path.join(projectPath, 'requirements.txt');
      try {
        const requirements = await fs.readFile(requirementsPath, 'utf-8');
        const pythonDeps = requirements.split('\n')
          .filter(line => line.trim() && !line.startsWith('#'))
          .map(line => line.split('==')[0].split('>=')[0].trim());
        dependencies.push(...pythonDeps);
      } catch (error) {
        // requirements.txt might not exist
      }
    } catch (error) {
      // Handle dependency extraction errors
    }
    
    return [...new Set(dependencies)]; // Remove duplicates
  }

  async analyzePurpose(statedPurpose) {
    const analysis = {
      stated_purpose: statedPurpose,
      core_objectives: this.extractCoreObjectives(statedPurpose),
      key_technologies: this.extractTechnologies(statedPurpose),
      domain_focus: this.identifyDomain(statedPurpose),
      success_criteria: this.defineSuccessCriteria(statedPurpose)
    };
    
    return analysis;
  }

  extractCoreObjectives(purpose) {
    const objectives = [];
    const lowerPurpose = purpose.toLowerCase();
    
    const objectiveKeywords = {
      'orchestration': 'workflow coordination',
      'deployment': 'application deployment',
      'security': 'security implementation',
      'monitoring': 'system monitoring',
      'optimization': 'performance optimization',
      'intelligence': 'intelligent automation',
      'analysis': 'data analysis',
      'management': 'resource management'
    };
    
    for (const [keyword, objective] of Object.entries(objectiveKeywords)) {
      if (lowerPurpose.includes(keyword)) {
        objectives.push(objective);
      }
    }
    
    return objectives;
  }

  extractTechnologies(purpose) {
    const technologies = [];
    const lowerPurpose = purpose.toLowerCase();
    
    const techKeywords = [
      'amazon q', 'aws', 'node.js', 'python', 'javascript', 'docker', 
      'kubernetes', 'mcp', 'api', 'database', 'postgresql', 'redis'
    ];
    
    for (const tech of techKeywords) {
      if (lowerPurpose.includes(tech)) {
        technologies.push(tech);
      }
    }
    
    return technologies;
  }

  identifyDomain(purpose) {
    const lowerPurpose = purpose.toLowerCase();
    
    if (lowerPurpose.includes('customer service') || lowerPurpose.includes('airline')) {
      return 'customer_service';
    } else if (lowerPurpose.includes('orchestration') || lowerPurpose.includes('workflow')) {
      return 'workflow_orchestration';
    } else if (lowerPurpose.includes('deployment') || lowerPurpose.includes('infrastructure')) {
      return 'infrastructure';
    } else if (lowerPurpose.includes('security')) {
      return 'security';
    } else {
      return 'general';
    }
  }

  defineSuccessCriteria(purpose) {
    // Extract measurable success criteria from purpose statement
    return [
      'implementation_matches_stated_purpose',
      'no_irrelevant_functionality',
      'all_components_serve_core_objectives'
    ];
  }

  async detectMisalignment(projectAnalysis, purposeAnalysis) {
    const misalignments = [];
    const alignedComponents = [];
    
    // Check each file for alignment with purpose
    for (const [filePath, fileAnalysis] of Object.entries(projectAnalysis.file_analysis)) {
      const alignment = this.assessFileAlignment(fileAnalysis, purposeAnalysis);
      
      if (alignment.score < 0.5) {
        misalignments.push({
          file: filePath,
          alignment_score: alignment.score,
          reasons: alignment.reasons,
          functions: fileAnalysis.functions_detected
        });
      } else {
        alignedComponents.push({
          file: filePath,
          alignment_score: alignment.score,
          purpose_served: alignment.purpose_served
        });
      }
    }
    
    const totalComponents = Object.keys(projectAnalysis.file_analysis).length;
    const alignmentPercentage = totalComponents > 0 
      ? ((totalComponents - misalignments.length) / totalComponents) * 100 
      : 100;
    
    return {
      alignment_percentage: Math.round(alignmentPercentage),
      misaligned_components: misalignments,
      aligned_components: alignedComponents,
      total_components: totalComponents,
      cleanup_required: misalignments.length > 0,
      severity: alignmentPercentage < 50 ? 'high' : alignmentPercentage < 80 ? 'medium' : 'low'
    };
  }

  assessFileAlignment(fileAnalysis, purposeAnalysis) {
    let score = 0;
    const reasons = [];
    const purposeServed = [];
    
    // Check if file keywords align with purpose
    const purposeKeywords = purposeAnalysis.core_objectives.join(' ').toLowerCase();
    
    for (const keywordData of fileAnalysis.keywords_detected) {
      if (purposeKeywords.includes(keywordData.keyword)) {
        score += 0.3;
        purposeServed.push(`contains_${keywordData.keyword}`);
      } else if (['customer', 'flight', 'booking', 'airline'].includes(keywordData.keyword) && 
                 purposeAnalysis.domain_focus !== 'customer_service') {
        score -= 0.4;
        reasons.push(`contains_irrelevant_${keywordData.keyword}_functionality`);
      }
    }
    
    // Check function names for alignment
    for (const func of fileAnalysis.functions_detected) {
      const funcName = func.name.toLowerCase();
      if (purposeKeywords.includes('orchestration') && funcName.includes('orchestrat')) {
        score += 0.4;
        purposeServed.push('orchestration_functionality');
      } else if (funcName.includes('customer') || funcName.includes('flight') || funcName.includes('booking')) {
        if (purposeAnalysis.domain_focus !== 'customer_service') {
          score -= 0.3;
          reasons.push(`irrelevant_function_${func.name}`);
        }
      }
    }
    
    return {
      score: Math.max(0, Math.min(1, score + 0.5)), // Normalize to 0-1 with base score
      reasons,
      purpose_served: purposeServed
    };
  }

  async generateCleanupPlan(alignmentAnalysis) {
    const plan = {
      actions: [],
      estimated_effort: 'medium',
      risk_level: 'low',
      backup_recommended: true
    };
    
    for (const misaligned of alignmentAnalysis.misaligned_components) {
      plan.actions.push({
        action: 'remove_or_refactor',
        target: misaligned.file,
        reason: `Alignment score: ${misaligned.alignment_score.toFixed(2)}`,
        details: misaligned.reasons,
        functions_affected: misaligned.functions.map(f => f.name)
      });
    }
    
    plan.estimated_effort = plan.actions.length > 5 ? 'high' : plan.actions.length > 2 ? 'medium' : 'low';
    
    return plan;
  }

  calculateConfidence(alignmentAnalysis) {
    const totalComponents = alignmentAnalysis.total_components;
    if (totalComponents === 0) return 0.5;
    
    const alignmentScore = alignmentAnalysis.alignment_percentage / 100;
    const componentCoverage = Math.min(totalComponents / 10, 1); // More components = higher confidence
    
    return (alignmentScore * 0.7) + (componentCoverage * 0.3);
  }
}

export default RealAlignmentEngineer;
