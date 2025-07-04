// Path of Exile AI Build Optimizer
class PoEBuildOptimizer {
    constructor() {
        this.currentBuild = null;
        this.currentSection = 'dashboard';
        this.analysisData = null;
        this.selectedGearSlot = null;
        this.marketData = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSampleData();
        this.startMarketDataUpdates();
        this.showSection('dashboard');
        this.updateMarketDisplay();
    }

    setupEventListeners() {
        // Header controls
        const leagueSelector = document.getElementById('leagueSelector');
        if (leagueSelector) {
            leagueSelector.addEventListener('change', (e) => {
                this.handleLeagueChange(e.target.value);
            });
        }

        const settingsBtn = document.getElementById('settingsBtn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                this.showSettings();
            });
        }

        // Dashboard actions
        const importBuildBtn = document.getElementById('importBuildBtn');
        if (importBuildBtn) {
            importBuildBtn.addEventListener('click', () => {
                this.showSection('import');
            });
        }

        const analyzeBuildBtn = document.getElementById('analyzeBuildBtn');
        if (analyzeBuildBtn) {
            analyzeBuildBtn.addEventListener('click', () => {
                this.startAnalysis();
            });
        }

        const exportBuildBtn = document.getElementById('exportBuildBtn');
        if (exportBuildBtn) {
            exportBuildBtn.addEventListener('click', () => {
                this.exportBuild();
            });
        }

        // Import section
        const importSubmitBtn = document.getElementById('importSubmitBtn');
        if (importSubmitBtn) {
            importSubmitBtn.addEventListener('click', () => {
                this.importBuild();
            });
        }

        const sampleBuildBtn = document.getElementById('sampleBuildBtn');
        if (sampleBuildBtn) {
            sampleBuildBtn.addEventListener('click', () => {
                this.loadSampleBuild();
            });
        }

        // Analysis navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchAnalysisTab(e.target.dataset.tab);
            });
        });

        // Gear slots
        document.querySelectorAll('.gear-slot').forEach(slot => {
            slot.addEventListener('click', (e) => {
                this.selectGearSlot(e.currentTarget.dataset.slot);
            });
        });

        // Build thumbnails
        document.querySelectorAll('.build-thumbnail').forEach(thumb => {
            thumb.addEventListener('click', () => {
                this.loadSampleBuild();
            });
        });
    }

    loadSampleData() {
        // Load sample build data
        this.sampleBuild = {
            id: "1",
            name: "Lightning Strike Champion",
            class: "Duelist",
            ascendancy: "Champion",
            level: 92,
            league: "Settlers",
            stats: {
                life: 6240,
                energyShield: 0,
                dps: 2850000,
                fireRes: 75,
                coldRes: 75,
                lightningRes: 75,
                chaosRes: -12
            },
            rating: "B+",
            issues: [
                {
                    severity: "High",
                    category: "Defense",
                    title: "Low Chaos Resistance",
                    description: "Chaos resistance at -12% makes you vulnerable to chaos damage",
                    impact: "Survivability"
                },
                {
                    severity: "Medium",
                    category: "Offense",
                    title: "Weapon Upgrade Available",
                    description: "Current weapon can be upgraded for 15% more DPS",
                    impact: "Damage Output"
                }
            ]
        };

        // Load gear pricing data
        this.gearPrices = {
            mainHand: {
                current: { name: "Rare Claw", value: 45, currency: "chaos" },
                upgrades: [
                    { name: "High PDPS Claw", value: 180, currency: "chaos", dpsGain: 15.2, costPerPercent: 8.9 },
                    { name: "Exceptional Claw", value: 420, currency: "chaos", dpsGain: 28.5, costPerPercent: 5.2 },
                    { name: "Perfect Claw", value: 950, currency: "chaos", dpsGain: 42.1, costPerPercent: 3.8 }
                ]
            },
            helmet: {
                current: { name: "Rare Helmet", value: 25, currency: "chaos" },
                upgrades: [
                    { name: "High Life Helmet", value: 85, currency: "chaos", ehpGain: 8.2, costPerPercent: 7.3 },
                    { name: "Enchanted Helmet", value: 250, currency: "chaos", ehpGain: 12.5, costPerPercent: 11.6 },
                    { name: "Perfect Helmet", value: 520, currency: "chaos", ehpGain: 18.7, costPerPercent: 15.2 }
                ]
            },
            chest: {
                current: { name: "Rare Chest", value: 120, currency: "chaos" },
                upgrades: [
                    { name: "High Life Chest", value: 200, currency: "chaos", ehpGain: 12.3, costPerPercent: 6.5 },
                    { name: "6-Link Chest", value: 450, currency: "chaos", dpsGain: 22.1, costPerPercent: 9.1 },
                    { name: "Perfect Chest", value: 800, currency: "chaos", ehpGain: 25.6, costPerPercent: 12.5 }
                ]
            }
        };

        // Load market data
        this.marketData = {
            currencyRates: {
                chaosOrb: 1,
                divineOrb: 165,
                exaltedOrb: 45,
                ancientOrb: 12
            },
            trending: [
                { item: "Divine Orb", price: 165, change: "+2%" },
                { item: "Mageblood", price: 450, change: "-3%" },
                { item: "Headhunter", price: 89, change: "+8%" }
            ]
        };

        // Load AI insights
        this.aiInsights = [
            "Your build has excellent damage output but needs defensive improvements",
            "Focus on chaos resistance and life to reach the next performance tier",
            "Consider weapon upgrade as highest ROI improvement",
            "Your skill tree is 87% efficient - good pathing overall"
        ];
    }

    showSection(sectionName) {
        console.log(`Switching to section: ${sectionName}`);
        
        // Hide all sections
        const sections = ['dashboardSection', 'importSection', 'analysisSection'];
        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                section.classList.add('hidden');
            }
        });

        // Show selected section
        const sectionMap = {
            'dashboard': 'dashboardSection',
            'import': 'importSection',
            'analysis': 'analysisSection'
        };

        const targetSectionId = sectionMap[sectionName];
        const targetSection = document.getElementById(targetSectionId);
        if (targetSection) {
            targetSection.classList.remove('hidden');
            console.log(`Showing section: ${targetSectionId}`);
        } else {
            console.error(`Section not found: ${targetSectionId}`);
        }

        this.currentSection = sectionName;
    }

    handleLeagueChange(league) {
        console.log(`Changed league to: ${league}`);
        this.updateMarketData(league);
    }

    loadSampleBuild() {
        console.log('Loading sample build...');
        const buildInput = document.getElementById('buildInput');
        if (buildInput) {
            buildInput.value = `Sample Path of Building Code

Lightning Strike Champion Build
Level 92 Duelist
Life: 6240
Energy Shield: 0
DPS: 2,850,000
Fire Resistance: 75%
Cold Resistance: 75%
Lightning Resistance: 75%
Chaos Resistance: -12%

This is a sample build for demonstration purposes.`;
        }
        
        // Auto-import after loading sample
        setTimeout(() => {
            this.importBuild();
        }, 500);
    }

    async importBuild() {
        console.log('Starting build import...');
        
        const buildInput = document.getElementById('buildInput');
        const importStatus = document.getElementById('importStatus');
        
        if (!buildInput) {
            console.error('Build input element not found');
            return;
        }
        
        const buildCode = buildInput.value.trim();

        if (!buildCode) {
            this.showImportStatus('Please enter a build code or pastebin URL', 'error');
            return;
        }

        this.showImportStatus('Importing build...', 'loading');

        try {
            // Simulate import process
            await this.delay(1000);

            // Use sample build data
            this.currentBuild = { ...this.sampleBuild };
            this.updateBuildDisplay();
            this.showImportStatus('Build imported successfully!', 'success');
            
            // Enable analyze button
            const analyzeBuildBtn = document.getElementById('analyzeBuildBtn');
            if (analyzeBuildBtn) {
                analyzeBuildBtn.disabled = false;
            }
            
            // Auto-switch to dashboard after successful import
            setTimeout(() => {
                this.showSection('dashboard');
            }, 1500);

        } catch (error) {
            console.error('Import error:', error);
            this.showImportStatus('Failed to import build. Please check your input.', 'error');
        }
    }

    showImportStatus(message, type) {
        const importStatus = document.getElementById('importStatus');
        if (importStatus) {
            importStatus.textContent = message;
            importStatus.className = `import-status ${type}`;
            importStatus.style.display = 'block';
        }
    }

    updateBuildDisplay() {
        if (!this.currentBuild) {
            console.log('No current build to display');
            return;
        }

        console.log('Updating build display with:', this.currentBuild);

        const buildName = document.getElementById('buildName');
        const buildClass = document.getElementById('buildClass');
        const buildRating = document.getElementById('buildRating');
        const statLife = document.getElementById('statLife');
        const statDPS = document.getElementById('statDPS');
        const statResistances = document.getElementById('statResistances');

        if (buildName) buildName.textContent = this.currentBuild.name;
        if (buildClass) buildClass.textContent = `Level ${this.currentBuild.level} ${this.currentBuild.ascendancy}`;
        if (buildRating) {
            buildRating.textContent = this.currentBuild.rating;
            buildRating.className = `build-rating rating-${this.currentBuild.rating.toLowerCase().replace('+', '')}`;
        }
        if (statLife) statLife.textContent = this.formatNumber(this.currentBuild.stats.life);
        if (statDPS) statDPS.textContent = this.formatNumber(this.currentBuild.stats.dps);
        if (statResistances) {
            statResistances.textContent = `${this.currentBuild.stats.fireRes}/${this.currentBuild.stats.coldRes}/${this.currentBuild.stats.lightningRes}`;
        }
    }

    async startAnalysis() {
        if (!this.currentBuild) {
            console.error('No build to analyze');
            return;
        }

        console.log('Starting analysis...');
        this.showLoadingOverlay();
        
        try {
            await this.runAnalysis();
            this.hideLoadingOverlay();
            this.showSection('analysis');
            console.log('Analysis completed successfully');
        } catch (error) {
            console.error('Analysis error:', error);
            this.hideLoadingOverlay();
            this.showNotification('Analysis failed. Please try again.', 'error');
        }
    }

    async runAnalysis() {
        console.log('Running analysis...');
        
        const progressSteps = [
            { text: 'Parsing build data...', duration: 800 },
            { text: 'Analyzing skill tree...', duration: 1200 },
            { text: 'Calculating defensive layers...', duration: 1000 },
            { text: 'Optimizing gear upgrades...', duration: 1500 },
            { text: 'Fetching market prices...', duration: 900 },
            { text: 'Generating recommendations...', duration: 700 }
        ];

        let totalProgress = 0;
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');

        for (let i = 0; i < progressSteps.length; i++) {
            const step = progressSteps[i];
            if (progressText) progressText.textContent = step.text;
            
            const targetProgress = ((i + 1) / progressSteps.length) * 100;
            await this.animateProgress(progressFill, totalProgress, targetProgress, step.duration);
            totalProgress = targetProgress;
        }

        // Generate analysis results
        this.analysisData = {
            overallRating: this.currentBuild.rating,
            scores: {
                offense: 92,
                defense: 73,
                efficiency: 87,
                economy: 65
            },
            recommendations: [
                {
                    priority: "High",
                    category: "Defense",
                    title: "Improve Chaos Resistance",
                    cost: 35,
                    improvement: "Survivability +12%"
                },
                {
                    priority: "Medium",
                    category: "Offense",
                    title: "Upgrade Main Hand Weapon",
                    cost: 180,
                    improvement: "DPS +15.2%"
                }
            ]
        };

        this.updateAnalysisDisplay();
        console.log('Analysis data generated:', this.analysisData);
    }

    async animateProgress(progressFill, startProgress, endProgress, duration) {
        return new Promise(resolve => {
            const startTime = Date.now();
            const progressDiff = endProgress - startProgress;

            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const currentProgress = startProgress + (progressDiff * progress);
                
                if (progressFill) {
                    progressFill.style.width = `${currentProgress}%`;
                }

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    resolve();
                }
            };

            requestAnimationFrame(animate);
        });
    }

    showLoadingOverlay() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.classList.remove('hidden');
        }
    }

    hideLoadingOverlay() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.classList.add('hidden');
        }
    }

    updateAnalysisDisplay() {
        // Update overall rating
        const overallRating = document.getElementById('overallRating');
        if (overallRating) {
            overallRating.textContent = this.analysisData.overallRating;
        }

        // Update AI insights
        this.updateAIInsights();
        
        // Enable export button
        const exportBuildBtn = document.getElementById('exportBuildBtn');
        if (exportBuildBtn) {
            exportBuildBtn.disabled = false;
        }
    }

    updateAIInsights() {
        const insightsList = document.getElementById('insightsList');
        if (!insightsList) return;

        insightsList.innerHTML = '';
        
        this.aiInsights.forEach(insight => {
            const insightItem = document.createElement('div');
            insightItem.className = 'insight-item';
            insightItem.innerHTML = `
                <span class="insight-icon">💡</span>
                <p>${insight}</p>
            `;
            insightsList.appendChild(insightItem);
        });
    }

    switchAnalysisTab(tabName) {
        console.log(`Switching to analysis tab: ${tabName}`);
        
        // Update nav buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }

        // Update tab content
        document.querySelectorAll('.analysis-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        const activeTab = document.getElementById(`${tabName}Tab`);
        if (activeTab) {
            activeTab.classList.add('active');
        }
    }

    selectGearSlot(slotName) {
        console.log(`Selecting gear slot: ${slotName}`);
        
        // Update selected slot
        document.querySelectorAll('.gear-slot').forEach(slot => {
            slot.classList.remove('selected');
        });
        
        const selectedSlot = document.querySelector(`[data-slot="${slotName}"]`);
        if (selectedSlot) {
            selectedSlot.classList.add('selected');
        }

        this.selectedGearSlot = slotName;
        this.updateUpgradePanel(slotName);
    }

    updateUpgradePanel(slotName) {
        const selectedSlot = document.getElementById('selectedSlot');
        const upgradeList = document.getElementById('upgradeList');

        if (selectedSlot) {
            selectedSlot.textContent = slotName.charAt(0).toUpperCase() + slotName.slice(1);
        }

        if (!upgradeList) return;

        const slotData = this.gearPrices[slotName];
        if (!slotData) {
            upgradeList.innerHTML = '<div class="upgrade-placeholder"><p>No upgrade data available for this slot</p></div>';
            return;
        }

        upgradeList.innerHTML = '';
        
        slotData.upgrades.forEach(upgrade => {
            const upgradeItem = document.createElement('div');
            upgradeItem.className = 'upgrade-item';
            
            const gainType = upgrade.dpsGain ? 'DPS' : 'EHP';
            const gainValue = upgrade.dpsGain || upgrade.ehpGain;
            
            upgradeItem.innerHTML = `
                <div class="upgrade-info">
                    <span class="upgrade-name">${upgrade.name}</span>
                    <span class="upgrade-stats">+${gainValue}% ${gainType} • ${upgrade.costPerPercent.toFixed(1)}c per %</span>
                </div>
                <div class="upgrade-cost">
                    <span class="upgrade-price">${upgrade.value}c</span>
                    <span class="upgrade-roi">ROI: ${(gainValue / upgrade.costPerPercent).toFixed(1)}%</span>
                </div>
            `;
            
            upgradeItem.addEventListener('click', () => {
                this.selectUpgrade(upgrade);
            });
            
            upgradeList.appendChild(upgradeItem);
        });
    }

    selectUpgrade(upgrade) {
        console.log('Selected upgrade:', upgrade);
        this.showNotification(`Selected: ${upgrade.name} for ${upgrade.value}c`, 'success');
    }

    exportBuild() {
        if (!this.currentBuild || !this.analysisData) {
            this.showNotification('No build analysis to export', 'error');
            return;
        }

        const exportData = {
            originalBuild: this.currentBuild,
            analysis: this.analysisData,
            recommendations: this.analysisData.recommendations,
            timestamp: new Date().toISOString()
        };

        // Create and download the export file
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `poe-build-analysis-${Date.now()}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();

        this.showNotification('Build analysis exported successfully!', 'success');
    }

    showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 24px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 1001;
            animation: slideIn 0.3s ease-out;
        `;

        if (type === 'success') {
            notification.style.background = 'var(--color-gaming-success)';
        } else if (type === 'error') {
            notification.style.background = 'var(--color-gaming-error)';
        } else if (type === 'info') {
            notification.style.background = 'var(--color-gaming-primary)';
        }

        document.body.appendChild(notification);

        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    showSettings() {
        console.log('Settings opened');
        this.showNotification('Settings feature coming soon!', 'info');
    }

    startMarketDataUpdates() {
        // Update market display initially
        this.updateMarketDisplay();
        
        // Simulate real-time market data updates
        setInterval(() => {
            this.updateMarketPrices();
        }, 10000); // Update every 10 seconds for demo
    }

    updateMarketPrices() {
        // Simulate price fluctuations
        if (this.marketData && this.marketData.trending) {
            this.marketData.trending.forEach(item => {
                const fluctuation = (Math.random() - 0.5) * 0.1; // ±5% max change
                const currentPrice = item.price;
                const newPrice = Math.max(1, Math.round(currentPrice * (1 + fluctuation)));
                
                if (newPrice !== currentPrice) {
                    const changePercent = ((newPrice - currentPrice) / currentPrice * 100).toFixed(1);
                    item.price = newPrice;
                    item.change = changePercent > 0 ? `+${changePercent}%` : `${changePercent}%`;
                }
            });
        }

        this.updateMarketDisplay();
    }

    updateMarketDisplay() {
        const marketItems = document.getElementById('marketItems');
        if (!marketItems || !this.marketData) return;

        marketItems.innerHTML = '';
        
        this.marketData.trending.forEach(item => {
            const marketItem = document.createElement('div');
            marketItem.className = 'market-item';
            
            const changeClass = item.change.startsWith('+') ? 'positive' : 'negative';
            const priceDisplay = item.item === 'Divine Orb' ? `${item.price}c` : `${item.price}div`;
            
            marketItem.innerHTML = `
                <span class="item-name">${item.item}</span>
                <span class="item-price">${priceDisplay}</span>
                <span class="price-change ${changeClass}">${item.change}</span>
            `;
            
            marketItems.appendChild(marketItem);
        });
    }

    updateMarketData(league) {
        // Simulate different market conditions for different leagues
        const leagueMultipliers = {
            'settlers': 1.0,
            'standard': 0.7,
            'hardcore': 1.3
        };

        const multiplier = leagueMultipliers[league] || 1.0;
        
        if (this.marketData && this.marketData.trending) {
            this.marketData.trending.forEach(item => {
                const basePrice = item.item === 'Divine Orb' ? 165 : 
                                 item.item === 'Mageblood' ? 450 : 89;
                item.price = Math.round(basePrice * multiplier);
            });
        }

        this.updateMarketDisplay();
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    .notification {
        transition: all 0.3s ease-out;
    }
`;
document.head.appendChild(style);

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing PoE Build Optimizer...');
    window.poeOptimizer = new PoEBuildOptimizer();
});

// Export for global access
window.PoEBuildOptimizer = PoEBuildOptimizer;