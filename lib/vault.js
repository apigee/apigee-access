/*
 * Copyright 2014 Apigee Corporation.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

'use strict';

var apigeeVault;

function Vault(mode) {

    if (mode === 'apigee') {
        this.impl = require('apigee-internal-secure-store');

    } else {
        this.impl = {
            "get" : function() {
                return("Not implemented locally")
            }
        };
    }
}

Vault.prototype.getVault = function(key, cb) {
    return(this.impl.get(process.env._APIGEE_APP_ID, key, function(err, item) {
        cb(err, item);
    }));
};

Vault.prototype.getVaultByEnvironment = function(key, cb) {
    return(this.impl.getByEnvironment(process.env._APIGEE_APP_ID, key, function(err, item) {
        cb(err, item);
    }));
};

module.exports.Vault = Vault;