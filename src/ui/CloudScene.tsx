import type { Genus } from '../core/weather/model.ts';
import type { Photo } from '../core/weather/photos.ts';
import { CLOUD_PHOTOS } from '../core/weather/photos.ts';

/**
 * A cloud photograph, with its credit. The credit names the photographer and
 * the licence and links to the original, as the licences require — but never
 * the file's title, which would name the cloud.
 */
export function CloudScene({ genus, photo }: { genus: Genus; photo: number; compact?: boolean }) {
  const photos: readonly Photo[] = CLOUD_PHOTOS[genus];
  const p = photos[photo % photos.length]!;
  return (
    <figure className="cloud-photo">
      <img
        src={`${import.meta.env.BASE_URL}${p.file}`}
        width={800}
        height={600}
        alt="A sky with cloud"
        loading="eager"
        decoding="async"
      />
      <figcaption>
        Photo: {p.artist} ·{' '}
        {p.licenceUrl ? (
          <a href={p.licenceUrl} target="_blank" rel="noreferrer">
            {p.licence}
          </a>
        ) : (
          p.licence
        )}{' '}
        ·{' '}
        <a href={p.source} target="_blank" rel="noreferrer">
          Wikimedia Commons
        </a>{' '}
        · cropped
      </figcaption>
    </figure>
  );
}
