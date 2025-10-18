import { useAirGate } from "@/air/useAirGate";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading";
import { Separator } from "@/components/ui/separator";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { formatDistanceToNow } from "date-fns";
import { AlertCircle, CheckCircle, Clock, ExternalLink, Shield, User, Wallet } from "lucide-react";
import { useAccount } from "wagmi";

export function Profile() {
  const { user, login, history, ready } = useAirGate();
  const { address, isConnected } = useAccount();

  const issuedCount = history.filter(h => h.type === "issued").length;
  const verifiedCount = history.filter(h => h.type === "verified").length;

  const formatAddress = (addr: string) => 
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  const getExplorerUrl = (type: "credential" | "program", id: string) =>
    `https://devnet-scan.mocachain.tech/address/${id}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Profile Dashboard
          </h1>
          <p className="text-gray-300 text-lg">
            Manage your digital identity and credentials
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - User Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* AIR Profile Card */}
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  AIR Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                {user ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-sm text-green-400">Connected</span>
                    </div>
                    <div className="text-sm text-gray-300">
                      <strong>User ID:</strong> {user.sub || user.id || "Anonymous"}
                    </div>
                    {user.email && (
                      <div className="text-sm text-gray-300">
                        <strong>Email:</strong> {user.email}
                      </div>
                    )}
                  </div>
                ) : !ready ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <LoadingSpinner size="sm" />
                      <span className="text-sm text-blue-400">Initializing AIR Kit...</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm text-yellow-400">Not Connected</span>
                    </div>
                    <Button 
                      onClick={login}
                      className="w-full bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
                    >
                      <Shield className="h-4 w-4" />
                      Login with AIR
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Wallet Card */}
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Wallet
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isConnected ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-sm text-green-400">Connected</span>
                    </div>
                    <div className="text-sm text-gray-300">
                      <strong>Address:</strong> {formatAddress(address!)}
                    </div>
                    <div className="text-sm text-gray-300">
                      <strong>Network:</strong> Moca Devnet
                    </div>
                    <a 
                      href={`https://devnet-scan.mocachain.tech/address/${address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300"
                    >
                      View on Explorer <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm text-yellow-400">Not Connected</span>
                    </div>
                    <ConnectButton />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle>Activity Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">{issuedCount}</div>
                    <div className="text-sm text-gray-400">Issued</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">{verifiedCount}</div>
                    <div className="text-sm text-gray-400">Verified</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Activity History */}
          <div className="lg:col-span-2">
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Credential History
                </CardTitle>
                <CardDescription>
                  Your recent credential activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                {history.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No credential activity yet</p>
                    <p className="text-sm">Start by verifying some credentials!</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {history
                      .sort((a, b) => b.at - a.at)
                      .map((item, index) => (
                        <div key={index}>
                          <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-800/50">
                            <div className={`p-2 rounded-full ${
                              item.type === "issued" 
                                ? "bg-blue-500/20 text-blue-400" 
                                : "bg-purple-500/20 text-purple-400"
                            }`}>
                              {item.type === "issued" ? (
                                <User className="h-4 w-4" />
                              ) : (
                                <Shield className="h-4 w-4" />
                              )}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant={item.type === "issued" ? "default" : "secondary"}>
                                  {item.type === "issued" ? "Issued" : "Verified"}
                                </Badge>
                                <span className="text-xs text-gray-400">
                                  {formatDistanceToNow(new Date(item.at), { addSuffix: true })}
                                </span>
                              </div>
                              
                              <div className="text-sm text-gray-200 mb-2">
                                {item.type === "issued" ? (
                                  <>
                                    <strong>Credential:</strong> {item.credentialId}
                                  </>
                                ) : (
                                  <>
                                    <strong>Program:</strong> {item.programId}
                                  </>
                                )}
                              </div>

                              {/* Explorer Link */}
                              {((item.type === "issued" && 'credentialId' in item) || 
                                (item.type === "verified" && 'programId' in item)) && (
                                <a
                                  href={getExplorerUrl(
                                    item.type === "issued" ? "credential" : "program",
                                    item.type === "issued" 
                                      ? (item as any).credentialId 
                                      : (item as any).programId
                                  )}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"
                                >
                                  View on Explorer <ExternalLink className="h-3 w-3" />
                                </a>
                              )}
                            </div>
                          </div>
                          
                          {index < history.length - 1 && (
                            <Separator className="my-2 bg-gray-700" />
                          )}
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}