import { AirButton } from '@/components/ui/air-button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Calculator, Clock, DollarSign, Download, FileBarChart, TrendingUp, Users } from 'lucide-react';
import { useCallback, useState } from 'react';

interface ROIInputs {
  users: number;
  verificationsPerUser: number;
  currentKYCCost: number;
  complianceStaff: number;
  averageSalary: number;
  auditCosts: number;
}

interface ROIResults {
  traditionalCosts: {
    kycCosts: number;
    staffCosts: number;
    auditCosts: number;
    total: number;
  };
  airgateCosts: {
    verificationCosts: number;
    integrationCosts: number;
    maintenanceCosts: number;
    total: number;
  };
  savings: {
    year1: number;
    year3: number;
    year5: number;
  };
  paybackPeriod: number;
  roi: number;
}

export function ROICalculator() {
  const [inputs, setInputs] = useState<ROIInputs>({
    users: 10000,
    verificationsPerUser: 4,
    currentKYCCost: 25,
    complianceStaff: 5,
    averageSalary: 75000,
    auditCosts: 50000,
  });

  const calculateROI = useCallback((): ROIResults => {
    const totalVerifications = inputs.users * inputs.verificationsPerUser;
    
    // Traditional costs (annual)
    const traditionalKYC = totalVerifications * inputs.currentKYCCost;
    const staffCosts = inputs.complianceStaff * inputs.averageSalary;
    const traditionalTotal = traditionalKYC + staffCosts + inputs.auditCosts;
    
    // AirGate costs (annual)
    const airgateVerificationCost = totalVerifications * 0.01; // $0.01 per verification
    const integrationCosts = 15000; // One-time integration
    const maintenanceCosts = 5000; // Annual maintenance
    const airgateTotal = airgateVerificationCost + maintenanceCosts;
    
    // Year 1 includes integration costs
    const year1Savings = traditionalTotal - (airgateTotal + integrationCosts);
    const year3Savings = (traditionalTotal * 3) - (airgateTotal * 3 + integrationCosts);
    const year5Savings = (traditionalTotal * 5) - (airgateTotal * 5 + integrationCosts);
    
    const paybackPeriod = integrationCosts / (traditionalTotal - airgateTotal);
    const roi = ((year5Savings - integrationCosts) / integrationCosts) * 100;
    
    return {
      traditionalCosts: {
        kycCosts: traditionalKYC,
        staffCosts,
        auditCosts: inputs.auditCosts,
        total: traditionalTotal,
      },
      airgateCosts: {
        verificationCosts: airgateVerificationCost,
        integrationCosts,
        maintenanceCosts,
        total: airgateTotal,
      },
      savings: {
        year1: year1Savings,
        year3: year3Savings,
        year5: year5Savings,
      },
      paybackPeriod,
      roi,
    };
  }, [inputs]);

  const results = calculateROI();

  const updateInput = (key: keyof ROIInputs, value: number) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const exportReport = () => {
    const report = {
      title: 'AirGate OS ROI Analysis Report',
      generatedAt: new Date().toISOString(),
      inputs,
      results,
      summary: {
        totalSavings5Years: results.savings.year5,
        paybackPeriod: `${results.paybackPeriod.toFixed(1)} months`,
        roi: `${results.roi.toFixed(1)}%`,
        costReduction: `${(((results.traditionalCosts.total - results.airgateCosts.total) / results.traditionalCosts.total) * 100).toFixed(1)}%`,
      }
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'airgate-roi-report.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
            <Calculator className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Enterprise ROI Calculator</h2>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Calculate your potential savings by switching from traditional KYC to AirGate's 
          zero-knowledge credential verification system.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Parameters</h3>
            
            <div className="space-y-6">
              {/* Users */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="font-medium">Number of Users</Label>
                  <Badge variant="outline">{formatNumber(inputs.users)}</Badge>
                </div>
                <Slider
                  value={[inputs.users]}
                  onValueChange={(value) => updateInput('users', value[0])}
                  max={1000000}
                  min={1000}
                  step={1000}
                  className="mb-2"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>1K</span>
                  <span>1M</span>
                </div>
              </div>

              {/* Verifications per User */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="font-medium">Verifications per User/Year</Label>
                  <Badge variant="outline">{inputs.verificationsPerUser}</Badge>
                </div>
                <Slider
                  value={[inputs.verificationsPerUser]}
                  onValueChange={(value) => updateInput('verificationsPerUser', value[0])}
                  max={20}
                  min={1}
                  step={1}
                  className="mb-2"
                />
              </div>

              {/* Current KYC Cost */}
              <div>
                <Label className="font-medium mb-2 block">Current KYC Cost per Verification</Label>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gray-500" />
                  <Input
                    type="number"
                    value={inputs.currentKYCCost}
                    onChange={(e) => updateInput('currentKYCCost', Number(e.target.value))}
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Compliance Staff */}
              <div>
                <Label className="font-medium mb-2 block">Compliance Staff Count</Label>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <Input
                    type="number"
                    value={inputs.complianceStaff}
                    onChange={(e) => updateInput('complianceStaff', Number(e.target.value))}
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Average Salary */}
              <div>
                <Label className="font-medium mb-2 block">Average Staff Salary</Label>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gray-500" />
                  <Input
                    type="number"
                    value={inputs.averageSalary}
                    onChange={(e) => updateInput('averageSalary', Number(e.target.value))}
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Annual Audit Costs */}
              <div>
                <Label className="font-medium mb-2 block">Annual Audit Costs</Label>
                <div className="flex items-center gap-2">
                  <FileBarChart className="w-4 h-4 text-gray-500" />
                  <Input
                    type="number"
                    value={inputs.auditCosts}
                    onChange={(e) => updateInput('auditCosts', Number(e.target.value))}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Results Panel */}
        <div className="space-y-6">
          {/* Cost Comparison */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Annual Cost Comparison</h3>
            
            <div className="space-y-4">
              {/* Traditional Costs */}
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-red-900">Traditional KYC</h4>
                  <span className="font-bold text-red-900">{formatCurrency(results.traditionalCosts.total)}</span>
                </div>
                <div className="space-y-1 text-sm text-red-700">
                  <div className="flex justify-between">
                    <span>Verification costs:</span>
                    <span>{formatCurrency(results.traditionalCosts.kycCosts)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Staff costs:</span>
                    <span>{formatCurrency(results.traditionalCosts.staffCosts)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Audit costs:</span>
                    <span>{formatCurrency(results.traditionalCosts.auditCosts)}</span>
                  </div>
                </div>
              </div>

              {/* AirGate Costs */}
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-green-900">AirGate OS</h4>
                  <span className="font-bold text-green-900">{formatCurrency(results.airgateCosts.total)}</span>
                </div>
                <div className="space-y-1 text-sm text-green-700">
                  <div className="flex justify-between">
                    <span>Verification costs:</span>
                    <span>{formatCurrency(results.airgateCosts.verificationCosts)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Maintenance:</span>
                    <span>{formatCurrency(results.airgateCosts.maintenanceCosts)}</span>
                  </div>
                </div>
              </div>

              {/* Savings Highlight */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <h4 className="font-medium text-blue-900">Annual Savings</h4>
                </div>
                <div className="text-2xl font-bold text-blue-900">
                  {formatCurrency(results.traditionalCosts.total - results.airgateCosts.total)}
                </div>
                <div className="text-sm text-blue-700">
                  {((1 - results.airgateCosts.total / results.traditionalCosts.total) * 100).toFixed(1)}% cost reduction
                </div>
              </div>
            </div>
          </Card>

          {/* ROI Metrics */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Return on Investment</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{results.paybackPeriod.toFixed(1)}</div>
                <div className="text-sm text-gray-600">Months to Payback</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{results.roi.toFixed(0)}%</div>
                <div className="text-sm text-gray-600">5-Year ROI</div>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Year 1 Savings:</span>
                <span className="font-medium text-gray-900">{formatCurrency(results.savings.year1)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">3-Year Savings:</span>
                <span className="font-medium text-gray-900">{formatCurrency(results.savings.year3)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">5-Year Savings:</span>
                <span className="font-bold text-green-600">{formatCurrency(results.savings.year5)}</span>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <AirButton onClick={exportReport} className="flex-1 gap-2">
              <Download className="w-4 h-4" />
              Export Report
            </AirButton>
            <AirButton variant="outline" className="gap-2">
              <Clock className="w-4 h-4" />
              Schedule Demo
            </AirButton>
          </div>

          {/* Additional Benefits */}
          <Card className="p-4 bg-purple-50">
            <h4 className="font-medium text-purple-900 mb-2">Additional Benefits</h4>
            <ul className="text-sm text-purple-800 space-y-1">
              <li>• 95% faster verification process</li>
              <li>• Enhanced user privacy and trust</li>
              <li>• Reduced regulatory compliance burden</li>
              <li>• Global scalability without data localization</li>
              <li>• Future-proof zero-knowledge architecture</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}