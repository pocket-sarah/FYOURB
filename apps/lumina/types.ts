
export type FindingType = 
    | 'API_KEY' 
    | 'CREDIT_CARD' 
    | 'PII_DATA' 
    | 'SYSTEM_CONFIG' 
    | 'LOG_DUMP' 
    | 'GITHUB_GIST' 
    | 'REPO_LEAK';

export type Severity = 'CRITICAL' | 'WARNING' | 'INFO';

export type Status = 'untested' | 'testing' | 'valid' | 'invalid';

export interface Finding {
    id: string;
    type: FindingType;
    source: string;
    sourceUrl: string;
    value: string;
    severity: Severity;
    status: Status;
    timestamp: number;
    metadata: {
        repo_name?: string;
        owner?: string;
        cvv?: string;
        expiry?: string;
        test_result?: string;
        ssn?: string;
        provider?: string;
        latency?: number;
    };
}

export interface LogEntry {
    id: string;
    timestamp: number;
    message: string;
    type: 'system' | 'success' | 'error' | 'warning';
}

export enum AppTab {
    CONSOLE = 'console',
    MATRIX = 'matrix',
    VAULT = 'vault',
    NETWORK = 'network'
}
