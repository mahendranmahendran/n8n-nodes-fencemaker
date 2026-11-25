import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class FencemakerApi implements ICredentialType {
	name = 'fencemakerApi';

	displayName = 'Fencemaker API';

	icon = { light: 'file:../nodes/Fencemaker/fencemaker.svg', dark: 'file:../nodes/Fencemaker/fencemaker.dark.svg' } as const;

	documentationUrl = 'https://github.com/mahendranmahendran/n8n-nodes-fencemaker?tab=readme-ov-file#credentials';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-API-Key': '={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://fencemaker.app/api/v1',
			url: '/devices',
		},
	};
}
