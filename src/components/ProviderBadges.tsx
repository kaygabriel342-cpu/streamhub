'use client';

import Image from 'next/image';
import { getLogoUrl } from '@/lib/tmdb/api';
import { TMDBProviderInfo } from '@/lib/tmdb/types';

interface ProviderBadgesProps {
  providers?: { [key: string]: TMDBProviderInfo };
  country?: string;
}

const providerNames: { [key: number]: string } = {
  8: 'Netflix',
  9: 'Amazon Prime Video',
  15: 'Hulu',
  337: 'Disney+',
  384: 'HBO Max',
  531: 'Paramount+',
  350: 'Apple TV+',
  444: 'Peacock',
  283: 'Crunchyroll',
  119: 'Amazon Video',
  2: 'Apple iTunes',
  3: 'Google Play Movies',
  68: 'Microsoft Store',
  192: 'YouTube',
  10: 'Amazon Instant Video',
  7: 'Vudu',
  279: 'Go3',
  422: 'Amazon Prime Video with Ads',
};

export default function ProviderBadges({ providers, country = 'US' }: ProviderBadgesProps) {
  if (!providers || !providers[country]) return null;

  const countryProviders = providers[country];
  const flatrate = countryProviders.flatrate || [];
  const rent = countryProviders.rent || [];
  const buy = countryProviders.buy || [];
  const ads = countryProviders.ads || [];

  if (flatrate.length === 0 && rent.length === 0 && buy.length === 0 && ads.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Streaming */}
      {flatrate.length > 0 && (
        <div>
          <h4 className="text-white font-medium mb-2">Stream</h4>
          <div className="flex flex-wrap gap-2">
            {flatrate.map((provider) => (
              <a
                key={provider.id}
                href={countryProviders.link}
                target="_blank"
                rel="noopener noreferrer"
                className="provider-badge hover:bg-[#333] transition-colors"
              >
                {provider.logo_path && (
                  <Image
                    src={getLogoUrl(provider.logo_path)}
                    alt={provider.name}
                    width={30}
                    height={30}
                    className="rounded"
                  />
                )}
                <span className="text-white">{providerNames[provider.id] || provider.name}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Free with Ads */}
      {ads.length > 0 && (
        <div>
          <h4 className="text-white font-medium mb-2">Free with Ads</h4>
          <div className="flex flex-wrap gap-2">
            {ads.map((provider) => (
              <a
                key={provider.id}
                href={countryProviders.link}
                target="_blank"
                rel="noopener noreferrer"
                className="provider-badge hover:bg-[#333] transition-colors"
              >
                {provider.logo_path && (
                  <Image
                    src={getLogoUrl(provider.logo_path)}
                    alt={provider.name}
                    width={30}
                    height={30}
                    className="rounded"
                  />
                )}
                <span className="text-white">{providerNames[provider.id] || provider.name}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Rent */}
      {rent.length > 0 && (
        <div>
          <h4 className="text-white font-medium mb-2">Rent</h4>
          <div className="flex flex-wrap gap-2">
            {rent.map((provider) => (
              <a
                key={provider.id}
                href={countryProviders.link}
                target="_blank"
                rel="noopener noreferrer"
                className="provider-badge hover:bg-[#333] transition-colors"
              >
                {provider.logo_path && (
                  <Image
                    src={getLogoUrl(provider.logo_path)}
                    alt={provider.name}
                    width={30}
                    height={30}
                    className="rounded"
                  />
                )}
                <span className="text-white">{providerNames[provider.id] || provider.name}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Buy */}
      {buy.length > 0 && (
        <div>
          <h4 className="text-white font-medium mb-2">Buy</h4>
          <div className="flex flex-wrap gap-2">
            {buy.map((provider) => (
              <a
                key={provider.id}
                href={countryProviders.link}
                target="_blank"
                rel="noopener noreferrer"
                className="provider-badge hover:bg-[#333] transition-colors"
              >
                {provider.logo_path && (
                  <Image
                    src={getLogoUrl(provider.logo_path)}
                    alt={provider.name}
                    width={30}
                    height={30}
                    className="rounded"
                  />
                )}
                <span className="text-white">{providerNames[provider.id] || provider.name}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
