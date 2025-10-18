const express = require('express');
const PublicKeyService = require('../services/PublicKeyService');
const { logger } = require('../utils/Logger');

const router = express.Router();

/**
 * Get RSA public key with Protobuf support
 * @route GET /crypto/public-key
 */
router.get('/public-key', async(req, res) => {
  try {
    const result = await PublicKeyService.getPublicKeyWithProtobuf();
    
    res.json({
      success: true,
      data: result.data,
      message: 'Public key with Protobuf support retrieved successfully'
    });
  } catch (error) {
    logger.error('Failed to get public key with Protobuf', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve public key with Protobuf',
      message: error.message
    });
  }
});

/**
 * Get public key information in structured format
 * @route GET /crypto/public-key-info
 */
router.get('/public-key-info', async(req, res) => {
  try {
    const result = await PublicKeyService.getPublicKeyInfo();
    
    res.json({
      success: true,
      data: result.data,
      message: 'Public key information retrieved successfully'
    });
  } catch (error) {
    logger.error('Failed to get public key info', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve public key information',
      message: error.message
    });
  }
});


module.exports = router;
