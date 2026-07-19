<script lang="ts">
    import type { Snippet } from 'svelte';

    let {
        portableText,
        children
    }: {
        portableText: { value?: { href?: string } };
        children?: Snippet;
    } = $props();

    const href = $derived(portableText?.value?.href ?? '#');
    const external = $derived(/^(https?:|mailto:|tel:)/i.test(href));
</script>

<a
    {href}
    class="text-accent underline hover:text-accent-soft"
    target={external ? '_blank' : undefined}
    rel={external ? 'noopener noreferrer' : undefined}
>
    {@render children?.()}
</a>
