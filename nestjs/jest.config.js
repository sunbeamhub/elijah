module.exports = {
  // 其他配置项
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: 'test-results/junit',
        outputName: 'junit.xml',
      },
    ],
  ],
};
